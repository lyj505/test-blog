import { Form } from "@remix-run/react";

import { saveAs } from "file-saver";

export default function Signup() {
  const formSubmit = (e) => {
    const formDom = e.target;
    const transNumberField = [
      "start",
      "end",
      "changeRow",
      "changeRowSmallDigtal",
      "changeTimeInterVal",
      "afterBalancePersistTime",
      // "startTime",
    ];
    const data = new FormData(formDom);
    const payload: any = {};
    for (let [name, value] of data) {
      if (transNumberField.includes(name)) {
        value = Number(value);
      }
      payload[name] = value;
    }
    e.preventDefault();
    // post a api
    fetch("/excel/request", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "合成"
        );
      });
  };
  return (
    <>
      <h1
        style={{
          textAlign: "center",
          fontSize: 30,
          margin: 10,
        }}
      >
        gen excel
      </h1>
      <Form onSubmit={formSubmit}>
        <p className="mt-10 ml-5 mb-5">
          <label>开始数值:</label>
          <input
            // defaultValue={1}
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="text"
            name="start"
            placeholder="请输入开始数值"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>结束数值:</label>
          <input
            // defaultValue={20}
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="number"
            name="end"
            placeholder="请输入结束数值"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>每次变化数值:</label>

          <input
            // defaultValue={2}
            step="0.01"
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="number"
            name="changeRow"
            placeholder="请输入每次变化数值"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>每次小数浮动位数:</label>

          <input
            defaultValue={2}
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="number"
            name="changeRowSmallDigtal"
            placeholder="请输入每次小数浮动位数"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>时间增量(30/60/90 s/次):</label>
          <input
            defaultValue={30}
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="number"
            name="changeTimeInterVal"
            placeholder="请输入时间增量"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>平稳后持续时间(分钟):</label>

          <input
            // defaultValue={1}
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="number"
            name="afterBalancePersistTime"
            placeholder="平稳后持续时间"
          />
        </p>
        <p className="ml-5 mb-5">
          <label>开始时间:</label>
          <input
            style={{
              width: 400,
              marginLeft: 10,
            }}
            required
            type="datetime-local"
            name="startTime"
            placeholder="开始时间"
          />
        </p>
        <button
          style={{
            backgroundColor: "#00a0e9",
            color: "#fff",
            borderRadius: 4,
            padding: 10,
          }}
          className="ml-5 mb-5"
          type="submit"
        >
          生成表格
        </button>
      </Form>
    </>
  );
}

export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <div>
      <h1>Error</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
