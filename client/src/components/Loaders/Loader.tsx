import { createPortal } from "react-dom";
function Loader() {
  return createPortal(
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-gray.100 dark:bg-slate-800 flex justify-center items-center">
      <span className="loader"></span>
    </div>,
    document.body
  );
}

export default Loader;
