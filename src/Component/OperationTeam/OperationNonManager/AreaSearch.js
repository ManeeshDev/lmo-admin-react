import React, { useState } from "react";
import { Select, Form } from "antd";
import axios from "axios";

export default function AreaSearch(props) {
  const [areaName, setAreaName] = useState(props?.businessAreas);

  const [areas, setAreas] = useState([]);

  const handleSearchArea = async (name) => {
    setAreaName(name);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/area?loc=${name}`
      );
      const data = await res.data;
      if (data.statusCode === 200) {
        setAreas(data.body);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const optionsVal = () => {
    return areas.map((x, i) => {
      return {
        value: x.location,
        code: x.id,
      };
    });
  };

  return (
    <Form.Item
      name={props?.name}
      label={props?.label}
      rules={[
        {
          required: props?.required,
        },
      ]}
    >
      <Select
        showSearch
        size="medium"
        mode={props?.multiple ? "multiple" : ""}
        style={{ width: props.width ? props.width : "100%" }}
        value={areaName}
        defaultValue={areaName ? areaName : []}
        options={optionsVal()}
        onSearch={handleSearchArea}
        allowClear={true}
        // onChange={(e) => props?.bsnAreas(e)}
        disabled={props.disabled}
        onSelect={(e, v) => {
          setAreaName(v.value);
          props.area_cd(v.code);
          if (props?.area_vl) {
            props.area_vl(v.value);
          }
        }}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Form.Item>
  );
}
