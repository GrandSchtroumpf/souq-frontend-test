/** Set view transition name in the style */
export const viewTransition = (id: string) => {
  return `view-transition-name: _${id.split(' ').join('-')}_`
}