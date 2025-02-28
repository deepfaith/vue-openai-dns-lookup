/**
 * Formats the given timestamp into a string with time and date.
 * @param value - The timestamp to format.
 * @returns A string representing the formatted time and date.
 */
const timeDisplay = (value: number)
:
string => {
  const date = new Date(value)
  let hours: string | number = date.getHours()
  let minutes: string | number = date.getMinutes()

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes

  return `${hours}:${minutes}, ${date.toLocaleDateString()}` || '-'
}

/**
 * Converts seconds into a minutes and seconds format.
 * @param secs - The total seconds to convert.
 * @returns A string representing the minutes and seconds.
 */
const minutesDisplaying = (secs: number)
:
string => {
  const mins: number = Math.floor(secs / 60)
  secs %= 60

  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
}

/**
 * Returns the local date string for the given timestamp or current date if no timestamp is provided.
 * @param value - The timestamp to convert.
 * @returns A string representing the local date.
 */
const dateDisplay = (value
? : number
):
string => {
  const now = new Date()
  const date = new Date(value || now)

  return date.toLocaleDateString()
}

export { dateDisplay, minutesDisplaying, timeDisplay }
