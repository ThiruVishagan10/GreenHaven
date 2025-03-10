export const PRODUCT_CATEGORIES = {
    INDOOR_PLANTS: 'Indoor Plants',
    OUTDOOR_PLANTS: 'Outdoor Plants',
    SUCCULENTS: 'Succulents',
    GARDENING_TOOLS: 'Gardening Tools'
  } as const;
  
  export const categoryOptions = [
    { value: PRODUCT_CATEGORIES.INDOOR_PLANTS, label: 'Indoor Plants' },
    { value: PRODUCT_CATEGORIES.OUTDOOR_PLANTS, label: 'Outdoor Plants' },
    { value: PRODUCT_CATEGORIES.SUCCULENTS, label: 'Succulents' },
    { value: PRODUCT_CATEGORIES.GARDENING_TOOLS, label: 'Gardening Tools' }
  ];
  
  export const allCategories = [
    { value: 'all', label: 'All Categories' },
    ...categoryOptions
  ];
  
  export const getCategoryLabel = (value: string): string => {
    return categoryOptions.find(cat => cat.value === value)?.label || value;
  };