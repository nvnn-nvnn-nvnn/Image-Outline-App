import React from "react";

import { useContext } from 'react'
import { Theme } from "@radix-ui/themes";
import '../App.css'

import { createContext, useState } from 'react';

// 1. Create the context
export const PageContext = createContext({

    currentPage: "App",
    setCurrentPage: () => {}

});


// 2. Create a Provider component that holds the state
export function PageProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('App');
  
  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  )};