import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./Components/Header"

const ProjectRoutes=()=>{
    return(<>
    <BrowserRouter>
  <Routes>
    <Route path='/header' element={<Header/>}/>
    <Route path='/' element={<Header/>}/>
  </Routes>
  </BrowserRouter>
    </>)
}
export default ProjectRoutes