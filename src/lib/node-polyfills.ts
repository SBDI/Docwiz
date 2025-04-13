/**
 * Node.js polyfills for browser environment
 * 
 * This file provides polyfills for Node.js built-in modules and globals
 * that might be required by Node.js libraries when used in the browser.
 */

// Polyfill for process.env
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = { env: {} };
}

// Export Buffer from the buffer package
export { Buffer } from 'buffer';

// Export this file as a module
export default {};
