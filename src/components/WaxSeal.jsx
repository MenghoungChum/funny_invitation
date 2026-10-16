/**
 * WaxSeal.jsx — ត្រាទិញ (wax seal) ប្រើរូបភាព download.png
 * ទំហំ/className ត្រូវបានបញ្ជាក់ពីខាងក្រៅ — ឆ្លើយតបនឹង viewport បានល្អ។
 * ចង់ប្តូររូប? ជំនួស src/assets/images/download.png ឬ public/assets/images/download.png
 */

import sign from "../assets/images/sign.png";

export default function WaxSeal({ size = 100, className = "" }) {
  return (
    <img
      src={sign}
      alt="ត្រាទិញលិខិតអញ្ជើញ"
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size, objectFit: "contain" }}
      className={`select-none ${className}`}
    />
  );
}
