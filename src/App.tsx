// ** Router Import

import Router from "./router/Router";
import React, { useEffect } from 'react'
import { useObserver } from "mobx-react";
import { appStore } from "./stores/appStore";

// const App = (props: any) => <Router />;

const App = () => useObserver(() => {
  useEffect(() => {
    appStore.GetAccounts();
  }, [])
  return (
    <Router />
  )
})

export default App;
