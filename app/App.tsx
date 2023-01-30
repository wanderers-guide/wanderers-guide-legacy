import * as React from "react";
import { useState } from "react";
import { CharacterList } from "./pages/CharacterList";

function App() {
  // In a full application, this would probably be the page router, but for now
  // we'll just abstract it as a simple component call

  return <CharacterList />;
}

export default App;
