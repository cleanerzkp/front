import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BigNumber } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGwei(wei: BigNumber): string {
  return (Number(wei.toString()) / 1e9).toFixed(0);
}
