/** @format */

export type Place = {
	name: string
	location: string
	userId: string
}

export interface PlaceType extends Place {
	id: number
}

export type Property = {
	name: string
	type: string
	minOccupancy: string
	maxOccupancy: string
	numSingleBeds: string
	numDoubleBeds: string
	state: string
	location: string
	placeId: number
}

export interface PropertyCardType extends Property {
	id: number
}

export const themeClass = ' bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 '

export const responsiveFontSizes = ' text-[8px] sm:text-[10px] md:text-[12px] lg:text-[15px]  xl:text-[18px] '

export const responsiveFontSizesTable = ' text-[10px] sm:text-[12px] md:text-[20px] lg:text-[25px]  xl:text-[30px] '

export interface TTLockCredentials {
	username: string
	password: string
}
