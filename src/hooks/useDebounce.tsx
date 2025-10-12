import { useState, useEffect, useRef } from "react";

/**
 * Debounces a value - delays updating the debounced value until after
 * the specified delay has passed since the last time the value changed.
 *
 * Perfect for: Search inputs, API calls triggered by user input,
 * expensive calculations, form validation
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function that runs when value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounces a callback function - delays calling the function until after
 * the specified delay has passed since the last time it was invoked.
 *
 * Perfect for: Button clicks, form submissions, API calls,
 * expensive operations that shouldn't run too frequently
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedCallback = ((...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Advanced debounce hook with additional features like immediate execution
 * and manual control over the debounced state
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @param immediate - If true, trigger on the leading edge instead of trailing
 * @returns Object with debounced value and utility functions
 */
export function useAdvancedDebounce<T>(
  value: T,
  delay: number,
  immediate: boolean = false
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const immediateRef = useRef(immediate);

  useEffect(() => {
    immediateRef.current = immediate;
  }, [immediate]);

  useEffect(() => {
    const handler = () => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    };

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (immediateRef.current && !isDebouncing) {
      // Execute immediately on first call
      handler();
      setIsDebouncing(true);
    } else {
      // Standard debounce behavior
      setIsDebouncing(true);
      timeoutRef.current = setTimeout(handler, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, isDebouncing]);

  // Manual cancel function
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsDebouncing(false);
    }
  };

  // Manual flush function (execute immediately)
  const flush = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setDebouncedValue(value);
      setIsDebouncing(false);
    }
  };

  return {
    debouncedValue,
    isDebouncing,
    cancel,
    flush,
  };
}

// Usage Examples and Explanations:

/*
=== useDebounce Example ===
Perfect for search inputs where you want to wait for user to stop typing

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // This will only run 500ms after user stops typing
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

=== useDebouncedCallback Example ===
Perfect for button clicks or actions that shouldn't happen too frequently

function ButtonComponent() {
  const debouncedSave = useDebouncedCallback((data) => {
    // This will only run once even if button is clicked multiple times
    saveToAPI(data);
  }, 1000);

  return (
    <button onClick={() => debouncedSave({ id: 1, name: 'test' })}>
      Save (Protected from double-clicks)
    </button>
  );
}

=== useAdvancedDebounce Example ===
When you need more control over the debouncing process

function AdvancedSearchComponent() {
  const [query, setQuery] = useState('');
  const { 
    debouncedValue, 
    isDebouncing, 
    cancel, 
    flush 
  } = useAdvancedDebounce(query, 300);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isDebouncing && <span>Searching...</span>}
      <button onClick={cancel}>Cancel Search</button>
      <button onClick={flush}>Search Now</button>
    </div>
  );
}

=== Key Differences ===

1. useDebounce:
   - Debounces VALUES
   - Returns the debounced value
   - Best for: Search inputs, form validation, expensive calculations

2. useDebouncedCallback:
   - Debounces FUNCTIONS
   - Returns a debounced function
   - Best for: Button clicks, API calls, form submissions

3. useAdvancedDebounce:
   - Enhanced debouncing with additional features
   - Provides status and manual controls
   - Best for: Complex UI interactions, when you need fine control

=== Performance Benefits ===

- Reduces API calls (from every keystroke to once per pause)
- Prevents expensive calculations on every render
- Improves user experience by reducing network traffic
- Prevents double-clicks and rapid successive actions
- Optimizes React re-renders

=== Common Use Cases ===

1. Search-as-you-type functionality
2. Auto-save forms
3. Resize event handlers
4. Scroll event handlers  
5. Button click protection
6. Real-time validation
7. API rate limiting
8. Expensive computations
*/
