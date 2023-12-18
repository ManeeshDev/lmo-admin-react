import { PlusOutlined } from "@ant-design/icons";
import { Divider, Upload } from "antd";
import Axios from "axios";
import React, { useState } from "react";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");

function ImageUploader({ pathParams, fetchData, path, returnImage, clear }) {
  const [activeFileList, setActiveFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setActiveFileList(fileList);
  };

  const imgProps = {
    onRemove: async (file) => {
      //   console.log(file, "file");
      //   try {
      //     const res = await Axios.post(
      //       `${process.env.REACT_APP_BASE_URL}/phtgrhr`,
      //       {},
      //       {
      //         headers: { authorization: token },
      //         params: {
      //           imgid: file.name,
      //           shpimg: "del",
      //         },
      //       }
      //     );
      //     const response = res.data;
      //     if (response) {
      //       message.info(response.body);
      //       const index = activeFileList.indexOf(file);
      //       const newactiveFileList = activeFileList.slice();
      //       newactiveFileList.splice(index, 1);
      //       setActiveFileList(newactiveFileList);
      //     }
      //   } catch (err) {
      //     console.log({ err });
      //   }
      // },
    },

    activeFileList,
  };

  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;

    // const path = userRole === "PHG" ? "phtgrhr" :  "hr";

    try {
      const res = await Axios.get(`${process.env.REACT_APP_BASE_URL}/${path}`, {
        headers: { authorization: token },
        params: {
          imgid: `image${file.name}`,
          ...pathParams,
        },
      });
      const response = res.data.body;
      const url = response.url;

      if (returnImage) {
        returnImage(response.domain);
      }
      const upload = await Axios.put(url, file);
      if (upload) {
        onSuccess("Ok");
        if (clear) {
          setActiveFileList([]);
        }
        if (fetchData) {
          fetchData();
          setActiveFileList([]);
        }
      }
    } catch (err) {
      onError({ err });
    }
  };

  return (
    <div>
      <Divider orientation="left">Upload Images</Divider>
      <Upload
        multiple={true}
        customRequest={handleUpload}
        {...imgProps}
        listType="picture-card"
        fileList={activeFileList}
        onChange={handleChange}
        accept=".png, .jpg, .jpeg"
      >
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      </Upload>
    </div>
  );
}

export default ImageUploader;
