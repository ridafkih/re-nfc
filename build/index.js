"use strict";
// const chars: string[] = [...'0123456789abcdef'];
// function shift(hex, passes = 1) {
//   if (passes <= 0) return hex;
//   return shift([...hex].map(char => {
//     const index = chars.indexOf(char) + 1;
//     return chars[index > chars.length - 1 ? 0 : index];
//   }).join("").substr(0, hex.length - 2) + "04", passes - 1);
// };
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var chars = __spreadArray([], new Array(16)).map(function (_, index) { return index.toString(16); });
