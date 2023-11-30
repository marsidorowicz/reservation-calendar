/** @format */

import { argv0 } from 'process'
import React, { useState, useEffect, useCallback } from 'react'
// Hook
export function useLocalStorage(key: string, initialValue: string) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState(() => {
		try {
			// Get from local storage by key
			if (typeof window !== 'undefined') {
				const item = window.localStorage.getItem(key)
				// Parse stored json or if none return initialValue
				return item ? JSON.parse(item) : initialValue
			}
		} catch (error) {
			// If error also return initialValue
			console.log(error)
			return initialValue
		}
	})
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value: (arg0: any) => any) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value
			// Save state
			setStoredValue(valueToStore)
			// Save to local storage
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error)
		}
	}
	return [storedValue, setValue]
}

export function useLocalStorageWithExpiry(key: string, initialValue: any, expiry: string) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once

	if (expiry === '1d' || expiry === '1w' || expiry === '1h') {
	} else {
		console.log('wrong time value, either 1d or 1w must be passed')
		return initialValue
	}
	const now = new Date().getTime()
	let time: number

	if (expiry === '1d') {
		time = 1 * 24 * 60 * 60 * 1000
	} else if (expiry === '1w') {
		time = 7 * 1 * 24 * 60 * 60 * 1000
	} else if (expiry === '1h') {
		time = 1 * 60 * 60 * 1000
	} else {
		return initialValue
	}

	const expiryTime: number = now + time

	const [storedValue, setStoredValue] = useState(() => {
		try {
			// Get from local storage by key
			if (typeof window !== 'undefined') {
				const item = window.localStorage.getItem(key)

				// Parse stored json or if none return initialValue
				if (!item) return initialValue
				const itemFromStr = JSON.parse(item)

				if (!itemFromStr?.expiry || !itemFromStr?.value) return initialValue
				if (now > itemFromStr?.expiry) {
					// If the item is expired, delete the item from storage
					// and return null
					console.log('item in cache expired')
					localStorage.removeItem(key)
					return initialValue
				}
				const until = itemFromStr?.expiry > now ? itemFromStr?.expiry - now : 0

				let timeLeft = (until / 1000 / 60).toFixed()
				console.log('time left in minutes until expiration of key: ' + key + ': ' + timeLeft)

				const value: string | null = itemFromStr?.value

				return value ? value : initialValue
			}
		} catch (error) {
			// If error also return initialValue
			console.log(error)
			return initialValue
		}
	})
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value: (arg0: any) => any) => {
		try {
			const itemWithExpiryValue: any = {
				value: value,
				// expiry: expiryTime
				expiry: now + time,
			}

			// Allow value to be a function so we have same API as useState
			if (value instanceof Function) {
				setStoredValue(value(storedValue))
			} else {
				setStoredValue(itemWithExpiryValue?.value)
			}

			// Save state

			// Save to local storage
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(itemWithExpiryValue))
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error)
		}
	}
	return [storedValue, setValue]
}
