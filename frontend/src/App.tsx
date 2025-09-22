import { Outlet } from "react-router-dom"
import CommonLayout from "./components/Layout/CommonLayout"
import './hooks/joyride-overrides.css';
function App() {

  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  )
}

export default App
