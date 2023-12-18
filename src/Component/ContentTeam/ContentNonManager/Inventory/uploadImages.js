import { PlusOutlined } from "@ant-design/icons";
import { Divider, Upload } from "antd";
import Axios from "axios";
import React, { useState } from "react";

const token = localStorage.getItem("token");
const cust_id = localStorage.getItem("cust_id");
const ctgry = localStorage.getItem("ctgry");
const sub_ctgry = localStorage.getItem("sub_ctgry");
const area = localStorage.getItem("area");

function UploadKyc({ images, setImages }) {
  const [activeFileList, setActiveFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setActiveFileList(fileList);
  };

  const imgProps = {
    onRemove: async (file) => {
      const index = activeFileList.indexOf(file);
      const newactiveFileList = activeFileList.slice();
      newactiveFileList.splice(index, 1);
      setActiveFileList(newactiveFileList);
    },

    activeFileList,
  };

  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      const res = await Axios.get(
        `https://api.mrch.dev.yourlmo.com/mrch-dev/1111111120/tn-hyd-hyd-580/10/110?imageid=image${file.name}`,
        {
          headers: { authorization: token },
        }
      );
      const response = res.data.data.url;
      const image_path = res.data.data.domain;
      const url = response;
      const upload = await Axios.put(url, file);
      if (upload.status) {
        onSuccess("Ok");
        setImages([...images, { image_url: image_path }]);
      }
    } catch (err) {
      onError({ err });
    }
  };

  return (
    <div>
      <Upload
        multiple={true}
        {...imgProps}
        listType="picture-card"
        fileList={activeFileList}
        customRequest={handleUpload}
        onChange={handleChange}
        accept=".png, .jpg, .jpeg, video/mp4,video/x-m4v,video/*"
      >
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      </Upload>
    </div>
  );
}

export default UploadKyc;
