const calculatePadding = (screenWidth: number): number => {
    const cardWidth = 302; // Width of each card
    const cardGap = 20; // Gap between cards
    const cardsPerRow = 2; // Two cards per row
  
    const totalWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * cardGap;

    if (screenWidth >= 768 && screenWidth < 1024) {
        return (screenWidth - totalWidth) / 2; 
    }
    return 0;
};

export default calculatePadding;
