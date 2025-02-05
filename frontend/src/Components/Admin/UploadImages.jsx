import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { useGetProductDetailsQuery } from "../../store/api/productAPI";
import { useParams } from "react-router-dom";
import { useRef } from 'react';

const UploadImages = () => {

const fileInputRef = useRef();
const{id} = useParams()
// Product Images
const[images, setImages] = useState([]);
// Uploaded Image Preview
const[imagePreview, setImagePreview] = useState([]);
// Uploaded Image to send.
const[uploadImages, setUploadImages] = useState([]);

// Get Product images to show 
const{data} = useGetProductDetailsQuery(id)

const onChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUploadImages(prev => [...prev, reader.result]);
          setImagePreview(prev => [...prev, reader.result]);
        }
      };
      
      reader.readAsDataURL(file); // Read current file, not always first file
    });
};

useEffect(() => {
    if(data){
        setImages([])
        const images = data?.product?.images.map(image => image.url)
        setImages(images)
    }   
},[data])

const handleImageDelete = (src) => () => {
    console.log("Clicked")
    const updatedImagePreview = imagePreview.filter(image => image !== src)
    setImagePreview(prev => updatedImagePreview)
    setUploadImages(prev => updatedImagePreview)
}

const handleFileInput = (e) => {
    fileInputRef.current.value = "";
}


  return (
    <>
    <AdminLayout>
    <div className="row wrapper">
      <div className="col-10 col-lg-8 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" enctype="multipart/form-data">
          <h2 className="mb-4">Upload Product Images</h2>
          <div className="mb-3">
            <label htmlFor="customFile" className="form-label">Choose Images</label>
            <div className="custom-file">
              <input
                type="file"
                name="product_images"
                className="form-control"
                id="customFile"
                multiple
                onChange={onChange}
                ref={fileInputRef}
                onClick={handleFileInput}
              />
            </div>
            <div className="new-images my-4">
              <p className="text-warning">New Images:</p>
              <div className="row mt-4">
                {uploadImages.length > 0 && uploadImages.map(image => {
                   return (
                    <div className="col-md-3 mt-2">
                    <div className="card">
                    <img
                      src={image}
                      alt="Card"
                      className="card-img-top p-2"
                      style={{"width": "100%", "height": "80px"}}
                    />
                    <button
                      style={{"backgroundColor": "#dc3545", "borderColor": "#dc3545"}}
                      type="button"
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                    >
                      <i className="fa fa-times" onClick={handleImageDelete(image)}></i>
                    </button>
                  </div>
                </div>
                  )})}
              </div>
            </div>
            <div className="uploaded-images my-4">
              <p className="text-success">Product Uploaded Images:</p>
                <div className="row mt-1">
              {images && images.map((image) => {
                return(
                    <div className="col-md-3 mt-2">
                    <div className="card">
                        <img
                            src={image}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{"width": "100%", "height": "80px"}}
                        />
                        <button
                            style={{"backgroundColor": "#dc3545", "borderColor": "#dc3545"}}
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            disabled="true"
                            type="button"
                        >
                        <i className="fa fa-trash" ></i>
                        </button>
                    </div>
                </div>)
              })}
            </div>
            </div>
            </div>
          <button id="register_button" type="submit" className="btn w-100 py-2">
            Upload
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
    </>
  )
};

export default UploadImages;
