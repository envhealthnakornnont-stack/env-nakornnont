// function NextIndex
export const getNextIndex = (currentIndex: number, length: number): number => {
    return (currentIndex + 1) % length;
  };

// function PrevIndex
export const getPrevIndex = (currentIndex: number, length: number): number => {
    return (currentIndex - 1 + length) % length;
  };

// function handle touch
export const handleSwipe = (
    touchStart: number | null,
    touchEnd: number | null,
    onNext: () => void,
    onPrev: () => void
  ): void => {
    if (touchStart === null || touchEnd === null) return;
  
    if (touchStart - touchEnd > 50) {
      onNext(); // Swipe left
    }
  
    if (touchEnd - touchStart > 50) {
      onPrev(); // Swipe right
    }
  };