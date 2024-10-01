import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TextFieldContextType {
  isValidate: boolean;
  checkPass: boolean;
  message: string;
  errorTransition: boolean;
  setIsValidate: (v: boolean) => void;
  setCheckPass: (v: boolean) => void;
  setMessage: (v: string) => void;
  setErrorTransition: (v: boolean) => void;
}

interface TextFieldProviderProps {
  children: ReactNode;
}

const TextFieldContext = createContext<TextFieldContextType | null>(null);

export const TextFieldProvider: React.FC<TextFieldProviderProps> = ({ children }) => {
  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  return (
    <TextFieldContext.Provider value={{
      isValidate,
      checkPass,
      message,
      errorTransition,
      setIsValidate,
      setCheckPass,
      setMessage,
      setErrorTransition
    }}>
      {children}
    </TextFieldContext.Provider>
  )
}

export const useTextFieldContext = () => () => {
  const context = useContext(TextFieldContext);

  if (!context) {
    throw 'context null';
  }

  return context;
}