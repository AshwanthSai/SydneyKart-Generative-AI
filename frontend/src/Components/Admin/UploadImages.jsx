import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { useDeleteProductImageMutation, useGetProductDetailsQuery, useProductUploadImageMutation } from "../../store/api/productAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from 'react';
import { toast } from "react-toastify";

const UploadImages = () => {

    const navigate = useNavigate();
    const fileInputRef = useRef();
    const{id} = useParams()
    // Product Images
    const[images, setImages] = useState([]);
    // Uploaded Image Preview
    const[imagePreview, setImagePreview] = useState([]);
    // Uploaded Image to send.
    const[uploadImages, setUploadImages] = useState([]);

    // Get Product images to prepopulate 
    const{data} = useGetProductDetailsQuery(id)

    const [uploadProductImages, {isError, isLoading, error, isSuccess }]
    = useProductUploadImageMutation();

    const [deleteImage, {isError: deleteImageIsError, isLoading : deleteImageIsLoading, error : deleteImageError, isSuccess : deleteImageSucess }]
    = useDeleteProductImageMutation();

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
            const images = data?.product?.images
            setImages(images)
        }
        if(isError){
            toast.error(error?.data?.message)
        }   
        if(deleteImageIsError){
          toast.error(deleteImageError?.data?.message)
        }
        if(deleteImageSucess){
          toast.success("Images deleted successfully")
        }
        if(isSuccess){
            toast.success("Images uploaded successfully")
            navigate("/admin/products")
        }
    },[data, error, isError, isSuccess])
    
    // Deleting Uploaded Product Images
    const deleteImageHandler = (img) => (e) => {
      e.preventDefault()
      deleteImage({id, imgId : img?.public_id})
    }

    // Deleting Previews
    const handleImageDelete = (src) => () => {
        const updatedImagePreview = imagePreview.filter(image => image !== src)
        setImagePreview(prev => updatedImagePreview)
        setUploadImages(prev => updatedImagePreview)
    }

    const handleResetFileInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    };

    const submitHandler = async(e) => {
        e.preventDefault()
        await uploadProductImages({id, uploadImages})
    }

  return (
    <>
    <AdminLayout>
    <div className="row wrapper">
      <div className="col-10 col-lg-8 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" enctype="multipart/form-data" onSubmit={submitHandler}>
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
                onClick={handleResetFileInput}
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
                      onClick={handleImageDelete(image)}
                    >
                      <i className="fa fa-times"></i>
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
                                src={image?.url}
                                alt="Card"
                                className="card-img-top p-2"
                                style={{"width": "100%", "height": "80px"}}
                            />
                            <button
                                style={{"backgroundColor": "#dc3545", "borderColor": "#dc3545"}}
                                className="btn btn-block btn-danger cross-button mt-1 py-0"
                                type="button"
                                disabled={isLoading || deleteImageIsLoading}
                                onClick={deleteImageHandler(image)}
                            >
                            <i className="fa fa-trash" ></i>
                            </button>
                        </div>
                    </div>
            )})}
            </div>
            </div>
            </div>
          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading || deleteImageIsLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
    </>
  )
};

export default UploadImages;
