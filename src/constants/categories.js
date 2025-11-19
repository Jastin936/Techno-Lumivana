// List of categories with icons
export const CATEGORY_LIST = [
  { name: 'All', icon: 'apps-outline' },
  { name: 'Graphic Design', icon: 'color-palette-outline' },
  { name: 'Illustration', icon: 'brush-outline' },
  { name: 'Crafting', icon: 'hammer-outline' },
  { name: 'Writing', icon: 'document-text-outline' },
  { name: 'Photography', icon: 'camera-outline' },
  { name: 'Tutoring', icon: 'school-outline' },
  { name: 'Custom Commission', icon: 'create-outline' },
];

// Map for quick icon lookup by category name
export const CATEGORY_ICON_MAP = CATEGORY_LIST.reduce((map, cat) => {
  map[cat.name] = cat.icon;
  return map;
}, {});
