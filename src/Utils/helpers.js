export function EmployeeOptions(data) {
  console.log(data, "data");
  var NMEmployeeList = [];
  data.map((item) => {
    // if (item.role === "NM") {
    var NMValue = {
      value: item.emp_id,
      label: item.name,
    };
    NMEmployeeList.push(NMValue);
    // }
  });
  return NMEmployeeList;
}

export const getMerchantId = (val) => {
  const value = val && val.split("/");
  const id = value[value.length - 1] && value[value.length - 1].split("-")[0];
  return id;
};
