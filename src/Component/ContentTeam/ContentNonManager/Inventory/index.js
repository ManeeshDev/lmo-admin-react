// import { Button, Col, Form, Input, Row, Select, Table, Tag } from "antd";
// import React, { useState } from "react";
// import categoryList from "../../../../Utils/categoryList";
// import ShortUniqueId from "short-unique-id";
// import numeral from "numeral";
// import UploadImages from "./uploadImages";

// const Codes = categoryList;

// function InventorySystem() {
//   const [form] = Form.useForm();

//   const [ctgyCode, setCtgy] = useState(null);
//   const [subctgyCode, setSubCtgy] = useState([]);
//   const [images, setImages] = useState([]);

//   const getCtgySubCtgyNames = (category, subCategory) => {
//     let ctgyCode = "";
//     category !== "0" ? (ctgyCode = category) : (ctgyCode = 10);
//     const ctgyArr = Codes.filter(
//       (x) => parseInt(x.ctgy) === parseInt(ctgyCode)
//     );
//     let subCtgyArr = [];
//     if (subCategory) {
//       subCtgyArr = ctgyArr[0].subCtgy.filter((y) => y.code === subCategory);
//     } else {
//       subCtgyArr = ctgyArr[0] ? ctgyArr[0].subCtgy : "";
//     }

//     const ctgyName = ctgyArr;
//     const subCtgyName = subCtgyArr;
//     return { ctgyName, subCtgyName };
//   };

//   const optionsVal = () => {
//     return Codes.map((x, i) => {
//       return {
//         value: x.name,
//         code: x.ctgy,
//       };
//     });
//   };

//   const optionsVal2 = () => {
//     if (ctgyCode) {
//       const subCtgy = getCtgySubCtgyNames(ctgyCode, "");
//       return subCtgy.subCtgyName.map((x, i) => {
//         return {
//           value: x.name,
//           code: x.code,
//         };
//       });
//     } else {
//       return [];
//     }
//   };

//   const insertItem = (e) => {
//     const uid = new ShortUniqueId({ length: 4 });

//     const cgy = numeral(ctgyCode).format("000");
//     const subcgy = numeral(subctgyCode).format("000");
//     const item_id = `${cgy}${subcgy}${uid()}`;

//     const schema = {
//       item_id,
//       itemImages: images,
//       ...e,
//       brand: e.brand ? e.brand : [],
//       description: e.description ? e.description : "NA",
//       ctgyCode,
//       subctgyCode,
//     };

//     console.log(schema, "schema");

//     setData([...data, schema]);

//     form.resetFields();
//   };

//   const [data, setData] = useState([]);

//   const columns = [
//     {
//       title: "Item",
//       dataIndex: "item",
//       key: "item",
//       render: (text) => <a>{text}</a>,
//     },
//     {
//       title: "Brand",
//       dataIndex: "brand",
//       key: "brand",
//       render: (x) =>
//         x.map((tag) => {
//           return (
//             <Tag color={"purple"} key={tag}>
//               {tag}
//             </Tag>
//           );
//         }),
//     },
//     {
//       title: "Size",
//       dataIndex: "size",
//       key: "size",
//       render: (x) =>
//         x.map((tag) => {
//           return (
//             <Tag color={"orange"} key={tag}>
//               {tag}
//             </Tag>
//           );
//         }),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Category",
//       dataIndex: "ctgyCode",
//       key: "ctgyCode",
//     },
//     {
//       title: "Sub Category",
//       dataIndex: "subctgyCode",
//       key: "subctgyCode",
//       render: (x) => (
//         <>
//           {x.map((tag) => {
//             let color = tag.length > 5 ? "geekblue" : "green";

//             return (
//               <Tag color={color} key={tag}>
//                 {tag}
//               </Tag>
//             );
//           })}
//         </>
//       ),
//     },
//     {
//       title: "Images",
//       dataIndex: "Images",
//       key: "Images",
//     },
//   ];

//   const children = [];

//   return (
//     <div>
//       <h2>Inventory</h2>
//       <Row>
//         <Col lg={24}>
//           <Form form={form} layout="vertical" onFinish={insertItem}>
//             <Row justify="space-between">
//               <Col lg={5}>
//                 <Form.Item
//                   label="Item"
//                   name="item"
//                   rules={[{ required: true }]}
//                 >
//                   <Input placeholder="Enter Item Name" />
//                 </Form.Item>
//               </Col>

//               <Col lg={5}>
//                 <Form.Item
//                   name="brand"
//                   label="Brand"
//                   rules={[
//                     {
//                       type: "array",
//                     },
//                   ]}
//                 >
//                   <Select
//                     placeholder="Agent Contract Areas"
//                     mode="tags"
//                     style={{ width: "100%" }}
//                     tokenSeparators={[","]}
//                   >
//                     {children}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col lg={5}>
//                 <Form.Item
//                   name="size"
//                   label="Size"
//                   rules={[
//                     {
//                       type: "array",
//                     },
//                   ]}
//                 >
//                   <Select
//                     placeholder="Agent Contract Areas"
//                     mode="tags"
//                     style={{ width: "100%" }}
//                     tokenSeparators={[","]}
//                   >
//                     {children}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col lg={5}>
//                 <Form.Item label="Description" name="description">
//                   <Input.TextArea placeholder="Enter Description" />
//                 </Form.Item>
//               </Col>

//               <Col lg={5}>
//                 <Form.Item
//                   name="ctgy_name"
//                   label="Category"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please input Category!",
//                     },
//                   ]}
//                 >
//                   <Select
//                     showSearch
//                     size="medium"
//                     style={{ width: "100%" }}
//                     options={optionsVal()}
//                     allowClear={true}
//                     onChange={() => form.setFieldsValue({ subCtgy: "" })}
//                     onSelect={(e, v) => {
//                       setCtgy(v.code);
//                     }}
//                     filterOption={(inputValue, option) =>
//                       option.value
//                         .toUpperCase()
//                         .indexOf(inputValue.toUpperCase()) !== -1
//                     }
//                   />
//                 </Form.Item>
//               </Col>

//               <Col lg={5}>
//                 <Form.Item
//                   label="Sub-Category"
//                   name="subCategory"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please input Sub Category!",
//                     },
//                   ]}
//                 >
//                   <Select
//                     showSearch
//                     mode="multiple"
//                     size="medium"
//                     style={{ width: "100%" }}
//                     options={optionsVal2()}
//                     allowClear={true}
//                     notFoundContent="Select Category First!"
//                     onChange={(e, v) => {
//                       setSubCtgy(v.map((x) => x.code));
//                     }}
//                     filterOption={(inputValue, option) =>
//                       option.value
//                         .toUpperCase()
//                         .indexOf(inputValue.toUpperCase()) !== -1
//                     }
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <UploadImages images={images} setImages={setImages} />

//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form>
//         </Col>
//       </Row>{" "}
//       <Table columns={columns} dataSource={data} />
//     </div>
//   );
// }

// export default InventorySystem;

import React from "react";
import Inventory from "../../../OperationTeam/OperationNonManager/Inventory";

function InventorySystem() {
  return (
    <div>
      <Inventory />
    </div>
  );
}

export default InventorySystem;
