const moment = require("moment");

const Excel = require("exceljs");

export const createExcel = async (_form: any) => {
  // 列 30 -> 90    数据个数：(90-30)*(60/(n))   n:(30秒计一次/60s计算一次)
  // 起始值(30)
  // 结束值(90)
  // 升降度() 每次变化速度 + (小数点位数)+-
  // 波动度() 平衡后波动速度  90 +- 波动度 随机
  // 平衡后持续时间(60)分钟 [(60*60s) / n]
  // 规则: 90 -> 30  升降。
  // 实验开始时间

  // 波动范围 每一次:60s不能大于几度() 5度       --> 30  90  1s 6度   10s  sample 10个 30 40 59....90(10s) 90s 90s 90s (波动度)

  // const jsonPath = path.join(__dirname, "./output");

  function numberFloatByDigital(num, digital) {
    const isAdd = Math.random(1) > 0.5;
    let baseNumber = parseInt(Math.random() * Math.pow(10, digital));
    if (baseNumber < Math.pow(10, digital - 1)) {
      baseNumber += Math.pow(10, digital - 1);
    }
    //   baseNumber = Number(Number("0." + baseNumber).toFixed(digital));
    baseNumber = Number("0." + baseNumber);
    // Math.pow(10, digital - 1) +
    //   87 /
    if (isAdd) {
      num += baseNumber;
    } else {
      num -= baseNumber;
    }
    num = num.toFixed(digital);
    return num;
  }

  function conditionEnd(start, end, isAdd) {
    // 等于可能会有问题
    if (isAdd) {
      return start <= end;
    } else {
      return end <= start;
    }
  }
  /**
   * @description {} 生成数据
   * @param  {开始数值} start
   * @param  {结束数值} end
   * @param  {每次变化数值} changeRow 每分钟5度
   * @param  {每次小数浮动位数} changeRowSmallDigtal
   * @param  {时间增量(s/次)} changeTimeInterVal // 30 60 90
   * @param  {平稳后持续时间(分钟)} afterBalancePersistTime
   * @param  {实验开始时间} startTime
   */
  const genNewArr = (
    start,
    end,
    changeRow,
    changeRowSmallDigtal,
    changeTimeInterVal,
    afterBalancePersistTime,
    startTime
    //   endTime
  ) => {
    console.log("--------start------");
    console.table({
      开始参数: start,
      结束参数: end,
      每次变化数值: changeRow,
      每次小数浮动位数: changeRowSmallDigtal,
      时间增量: changeTimeInterVal,
      平稳后持续时间: afterBalancePersistTime,
      开始时间: startTime,
    });
    // console.log("开始参数1", start);
    // 上升下降怎么写
    changeRow = (changeRow * 60) / changeTimeInterVal;
    const isAdd = start < end;
    start = numberFloatByDigital(start, changeRowSmallDigtal);
    let changeArr = [
      {
        val: start,
        time: startTime,
      },
    ];
    start = Number(start);
    while (conditionEnd(start, end, isAdd)) {
      if (isAdd) {
        start += changeRow;
      } else {
        start -= changeRow;
      }
      start = numberFloatByDigital(start, changeRowSmallDigtal);
      // console.log("start1", start);
      startTime += changeTimeInterVal * 1000;
      changeArr.push({
        val: start,
        time: startTime,
      });
      start = Number(start);
    }

    startTime += changeTimeInterVal * 1000;
    changeArr.push({
      val: numberFloatByDigital(end, changeRowSmallDigtal),
      time: startTime,
      text: "间隔时间",
    });

    const persistLength = Math.ceil(
      (afterBalancePersistTime * 1000 * 60) / (changeTimeInterVal * 1000)
    );

    for (let i = 0; i < persistLength; i++) {
      startTime += changeTimeInterVal * 1000;
      changeArr.push({
        val: numberFloatByDigital(end, changeRowSmallDigtal),
        time: startTime,
      });
    }

    changeArr.forEach((ele) => {
      ele.originTime = ele.time;
      ele.time = moment(ele.time).format("MM/DD/YY");
    });

    return changeArr;

    //   const
  };

  // const startTime = moment("2022/07/03 12:19:12").valueOf();
  const startTime = moment(_form.startTime).valueOf();
  // console.log("startTime", startTime);
  // console.log("llll", moment(_form.startTime).valueOf());
  // genNewArr(100, 60, 5, 2, 20, 5, startTime);
  const changeArr = genNewArr(
    _form.start,
    _form.end,
    _form.changeRow,
    _form.changeRowSmallDigtal,
    _form.changeTimeInterVal,
    _form.afterBalancePersistTime,
    startTime
    // _form.startTime
  );

  // fs.writeFileSync(
  //   path.join(jsonPath, "res.json"),
  //   JSON.stringify(
  //     {
  //       data: changeArr,
  //     },
  //     null,
  //     4
  //   )
  // );

  console.log("数据长度end11", changeArr.length);
  return await exTest(changeArr, _form.end);
};

async function exTest(changeArr, end) {
  // save under export.xlsx

  //load a copy of export.xlsx
  const newWorkbook = new Excel.Workbook();
  // await newWorkbook.xlsx.readFile("export.xlsx");
  const sheet = newWorkbook.addWorksheet("My Sheet");
  // const newworksheet = newWorkbook.getWorksheet("My Sheet");
  sheet.columns = [
    { header: "Date", key: "date1", width: 30 },
    { header: "Time", key: "time1", width: 32 },
    { header: "Chm_常量", key: "constants", width: 30 },
    { header: "Chm_变化量", key: "val", width: 30 },
  ];

  for (let i = 0; i < changeArr.length; i++) {
    const ele = changeArr[i];
    const { time, val, originTime } = ele;
    await sheet.addRow({
      date1: time,
      time1: moment(originTime).format("hh:mm:ss"),
      val: val,
      constants: end,
    });
  }

  let res = await newWorkbook.xlsx.writeBuffer({ base64: true });
  // console.log("File is written", res);
  // console.log("File is written---", typeof res);
  return res;
}
