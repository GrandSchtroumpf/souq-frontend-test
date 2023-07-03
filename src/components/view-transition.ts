/** Set view transition name in the style */
export const viewTransition = (id: string | number) => {
  return `view-transition-name: _${id.toString().split(' ').join('-')}_`
}