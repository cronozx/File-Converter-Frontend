'use client'

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import axios from 'axios';
import { SelectElement } from "./convertButtons";
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from "@mui/material";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{[key: string]: string}>({})

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }

  const validateSize = (file: File) => {
    if (file.size > 100000000) {
      return {
        code: "file-too-large",
        message: "File size exceeds 100MB limit"
      };
    }

    console.log(file.type);
    return null;
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    validator: validateSize, 
    onDropRejected: () => {
      const warn = document.querySelector('.upload-error-warn');
      warn?.classList.remove('display');
    }
  });

  const handleSubmit = (fileToUpload: File, convertType: string) => {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('file-type', fileToUpload.type.split("/")[1]);
    formData.append('convert-type', convertType);
  
    axios.post('http://localhost:8080/api/upload', formData, { responseType: 'blob' })
      .then(response => {
        console.log(response.headers)
        const data = response.data;
        console.log(response.data);
        const fileType: string = response.headers['content-type']?.toString() || '';
        const fileName: string = response.headers['content-disposition']?.toString();
  
        downloadFile(data, fileType, fileName);
  
        setFiles((prevFiles) => [...prevFiles.filter(file => file !== fileToUpload)]);
      }).catch(error => {
        console.log("File couldn't be sent", error);
      });
  }

  const downloadFile = (data: any, fileType: string, fileName:string) => {
    const fileBlob = new Blob([data], { type: fileType });
  
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleRemove = (fileToRemove: File) => {
      setFiles((prevFiles) => [...prevFiles.filter(file => file !== fileToRemove)]);
  }

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <header className="title text-lg sm:text-xl lg:text-2xl font-extrabold drop-shadow-(--glow) mt-4 sm:mt-6 lg:mt-8">File Converter</header>

      <div className="upload-box-title text-lg sm:text-xl lg:text-2xl font-bold mt-10 sm:mt-20 lg:mt-40 drop-shadow-(--glow)">Upload (100MB Limit)</div>
      <div className="upload-box dropzone transition duration-[1s] ease-in-out hover:bg-black-900 w-full sm:w-3/4 lg:w-2/5 h-64 sm:h-80 lg:h-[24rem] flex justify-center bg-transparent rounded-sm border-dashed border-black-foreground border-5 z-2 mt-2" {...getRootProps()}>
        <input {...getInputProps()}></input>
        <div className="upload-box-desc mt-16 sm:mt-24 lg:mt-40 text-center">Drag and Drop Files Here <br></br> Or Click to Upload Files</div>
        <div className="upload-error-warn absolute mt-20 sm:mt-32 lg:mt-56 text-center font-bold text-red-600 hidden">File Size to Big</div>
      </div>
        <h2 className="uploaded-files-header mt-20 sm:mt-28 lg:mt-[35vh] font-bold drop-shadow-(--glow)">Uploaded Files:</h2>
        <div className="uploaded-files-container w-full sm:w-3/4 lg:w-2/5 h-64 sm:h-80 lg:h-[50vh] text-center rounded-sm border-solid border-black-foreground border-5">
          <ul className="uploaded-files">
            {files.map((file, index) => {
              const uniqueKey = `${file.name}_${file.type}_${index}`;
              return (
                <li key={uniqueKey} className="flex items-center justify-between mt-1">
                  <div className="file-name-container font-bold text-left text-xs sm:text-sm lg:text-base w-1/3 truncate ml-1">File Name: {file.name}</div>
                  <SelectElement file={file} uniqueKey={uniqueKey} setType={setSelectedTypes}/>
                  <div className="flex items-center gap-2 mr-1">
                    <Button className="submit-button text-black-950 bg-black-50 hover:bg-black-500" variant="contained" sx={{backgroundColor: 'white', color: 'black'}} startIcon={<CheckIcon/>} onClick={() => {handleSubmit(file, selectedTypes[uniqueKey])}}>Convert</Button>
                    <Button className="remove-button text-black-950 bg-black-50 hover:bg-black-500" variant="contained" sx={{backgroundColor: 'white', color: 'black'}} startIcon={<DeleteForeverIcon/>} onClick={() => handleRemove(file)}>Remove</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
    </div>
  );
}