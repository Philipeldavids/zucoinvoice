import React, {useContext, createContext, useState} from 'react'

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
  };