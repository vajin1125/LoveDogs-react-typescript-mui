import React from "react"
import Home from "./Home"
import {act, fireEvent, render, screen} from "@testing-library/react"
import {mockResult} from "../test/mockData"

// global.fetch = jest.fn(() => Promise.resolve(mockResult))

describe("Home component test", () => {
  it("render component working correctly", async () => {
    render(<Home />)
    expect(screen.getByTestId("home-title")).toHaveTextContent("Find out your faviorate dogs")
    // expect((await screen.getAllByTestId("dog-card")).length).toBe(127)
  })
})