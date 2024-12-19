import { configureStore } from '@reduxjs/toolkit'

function empty() {
  return null
}

const store = configureStore({
  reducer : {empty},
})

export default store