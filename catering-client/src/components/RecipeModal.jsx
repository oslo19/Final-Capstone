import React from 'react'
import { AuthContext } from "../contexts/AuthProvider";

const RecipeModal = ({description}) => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  return (
    <dialog id="my_modal_6" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
        
            <h3 className="font-bold text-lg">Description</h3>
            <div className="divider divider-warning w-full"></div>
            <p>{description}</p>

           

            {/* close btn */}
            <div
              htmlFor="my_modal_6"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_6").close()}
            >
              ✕
            </div>

   

        </div>
      </div>
    </dialog>
  )
}

export default RecipeModal