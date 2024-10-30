// import {useEffect, useMemo, useState} from 'react';
// import Tippy from '@tippyjs/react';
// import Calendar from 'rc-calendar';
// import moment from 'moment';
// import clsx from 'clsx';

// import FieldWrapper from './FieldWrapper';

// const DateField = (props) => {
//   const {question, value, onChange, oerror = false} = props;
//   const [visible, setVisible] = useState(false);
//   const [lazy, setLazy] = useState(false);
//   const format = 'MM-DD-YYYY';
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     setLazy(true);
//   }, []);

//   useEffect(() => {
//     setError(oerror);
//   }, [oerror]);

//   const extendedInfo = useMemo(() => {
//     if (!question) return {};
//     try {
//       return JSON.parse(question.extendedInfo);
//     } catch {
//       return {};
//     }
//   }, [question]);

//   return (
//     <FieldWrapper
//       label={
//         <label htmlFor={question.id} className="font-medium h-min">
//           {question.optional ? null : <span className="text-red-500">*</span>}
//           {question.title}
//         </label>
//       }
//       helptext={extendedInfo.helptext}
//     >
//       {lazy && (
//         <Tippy
//           interactive
//           arrow={false}
//           theme="light"
//           visible={visible}
//           placement="bottom"
//           content={
//             <Calendar
//               showToday={false}
//               showDateInput={false}
//               value={moment(value)}
//               onChange={(newV) => {
//                 onChange(newV.toISOString());
//                 setError(false);
//               }}
//             />
//           }
//           appendTo={document.body}
//           onHidden={() => setVisible(false)}
//           onClickOutside={() => setVisible(false)}
//         >
//           <div
//             id={question.id}
//             onClick={() => setVisible(true)}
//             className={clsx(
//               error ? 'border-red-500' : 'border-gray-300',
//               'flex items-center justify-between w-full h-10 px-4 text-[14px] border border-solid rounded-lg outline-none hover:border-primary focus:border-primary placeholder:text-[14px] placeholder:text-gray-500 ring-0',
//             )}
//           >
//             <p className="mobild:text-xs">
//               {value
//                 ? moment(value).format('MM-DD-YYYY')
//                 : extendedInfo.placeholder ?? format}
//             </p>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               width="15"
//               height="15"
//               viewBox="0 0 15 15"
//             >
//               <path
//                 d="M2.813.75q0-.074.014-.146Q2.84.53 2.87.463q.028-.068.069-.13.04-.061.093-.113.052-.053.114-.094.061-.04.13-.069.068-.028.14-.043Q3.49 0 3.563 0q.073 0 .146.014.072.015.14.043.069.028.13.07.062.04.114.093.052.052.093.113.041.062.07.13.028.068.042.14.014.073.014.147v.938h6.375V.75q0-.074.015-.146.014-.073.043-.141.028-.068.069-.13.04-.061.093-.113.052-.053.114-.094.061-.04.13-.069.068-.028.14-.043.073-.014.146-.014.074 0 .147.014.072.015.14.043.069.028.13.07.062.04.114.093.052.052.093.113.041.062.07.13.028.068.042.14.014.073.014.147v.938h.376q1.01 0 1.723.713.714.714.714 1.724v8.438q0 1.01-.714 1.723-.714.714-1.723.714H2.437q-1.01 0-1.723-.714Q0 13.572 0 12.563V4.124q0-1.01.714-1.724.714-.713 1.724-.713h.374V.75zm.75 2.438H2.437q-.388 0-.662.274-.275.275-.275.663v.554q.432-.179.938-.179h10.124q.506 0 .938.18v-.555q0-.388-.275-.663-.274-.275-.662-.275h-9zm9.937 3.75q0-.389-.275-.663Q12.951 6 12.563 6H2.437q-.388 0-.662.275-.275.274-.275.662v5.625q0 .389.275.663.274.275.663.275h10.124q.389 0 .663-.275.275-.274.275-.662V6.936zM6.75 8.063v.005q0 .074.014.147.015.072.043.14.028.069.07.13.04.062.093.114.052.052.113.093.062.041.13.07.068.028.14.042.073.014.147.014h.006q.074 0 .146-.014.073-.014.141-.043.068-.028.13-.069.061-.04.113-.093.053-.052.094-.114.04-.061.069-.13.028-.068.043-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.015-.072-.043-.14-.028-.069-.07-.13-.04-.062-.093-.114-.052-.052-.113-.093-.062-.041-.13-.07-.068-.028-.14-.042-.073-.014-.147-.014H7.5q-.074 0-.146.014-.073.014-.141.043-.068.028-.13.069-.061.04-.113.093-.053.052-.094.114-.04.061-.069.13-.028.068-.043.14-.014.073-.014.146zm1.688 0v.005q0 .074.014.147.014.072.043.14.028.069.069.13.04.062.093.114.052.052.114.093.061.041.13.07.068.028.14.042.073.014.146.014h.007q.073 0 .146-.014.072-.014.14-.043.069-.028.13-.069.062-.04.114-.093.052-.052.093-.114.041-.061.07-.13.028-.068.042-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.014-.072-.043-.14-.028-.069-.069-.13-.04-.062-.093-.114-.052-.052-.114-.093-.061-.041-.13-.07-.068-.028-.14-.042-.073-.014-.146-.014h-.007q-.073 0-.146.014-.072.014-.14.043-.069.028-.13.069-.062.04-.114.093-.052.052-.093.114-.041.061-.07.13-.028.068-.042.14-.014.073-.014.146zm1.687 0v.005q0 .074.014.147.015.072.043.14.028.069.07.13.04.062.093.114.052.052.113.093.062.041.13.07.068.028.14.042.073.014.147.014h.006q.074 0 .146-.014.073-.014.141-.043.068-.028.13-.069.061-.04.113-.093.053-.052.094-.114.04-.061.069-.13.028-.068.043-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.015-.072-.043-.14-.028-.069-.07-.13-.04-.062-.093-.114-.052-.052-.113-.093-.062-.041-.13-.07-.068-.028-.14-.042-.073-.014-.147-.014h-.006q-.074 0-.146.014-.073.014-.141.043-.068.028-.13.069-.061.04-.113.093-.053.052-.094.114-.04.061-.069.13-.028.068-.043.14-.014.073-.014.146zM3.375 9.75v.006q0 .074.014.146.015.073.043.141.028.068.07.13.04.061.093.113.052.053.113.094.062.04.13.069.068.028.14.043.073.014.147.014h.006q.074 0 .146-.014.073-.015.141-.043.068-.028.13-.07.061-.04.113-.093.053-.052.094-.113.04-.062.069-.13.028-.068.043-.14.014-.073.014-.147V9.75q0-.074-.014-.146-.015-.073-.043-.141-.028-.068-.07-.13-.04-.061-.093-.113-.052-.053-.113-.094-.062-.04-.13-.069-.068-.028-.14-.043Q4.204 9 4.13 9h-.006q-.074 0-.146.014-.073.015-.141.043-.068.028-.13.07-.061.04-.113.093-.053.052-.094.113-.04.062-.069.13-.028.068-.043.14-.014.073-.014.147zm1.688 0v.006q0 .074.014.146.014.073.043.141.028.068.069.13.04.061.093.113.052.053.114.094.061.04.13.069.068.028.14.043.073.014.146.014h.006q.074 0 .147-.014.072-.015.14-.043.069-.028.13-.07.062-.04.114-.093.052-.052.093-.113.041-.062.07-.13.028-.068.042-.14.014-.073.014-.147V9.75q0-.074-.014-.146-.014-.073-.043-.141-.028-.068-.069-.13-.04-.061-.093-.113-.052-.053-.114-.094-.061-.04-.13-.069-.068-.028-.14-.043Q5.892 9 5.819 9h-.006q-.074 0-.147.014-.072.015-.14.043-.069.028-.13.07-.062.04-.114.093-.052.052-.093.113-.041.062-.07.13-.028.068-.042.14-.014.073-.014.147zm1.687 0v.006q0 .074.014.146.015.073.043.141.028.068.07.13.04.061.093.113.052.053.113.094.062.04.13.069.068.028.14.043.073.014.147.014h.006q.074 0 .146-.014.073-.015.141-.043.068-.028.13-.07.061-.04.113-.093.053-.052.094-.113.04-.062.069-.13.028-.068.043-.14.014-.073.014-.147V9.75q0-.074-.014-.146-.015-.073-.043-.141-.028-.068-.07-.13-.04-.061-.093-.113-.052-.053-.113-.094-.062-.04-.13-.069-.068-.028-.14-.043Q7.58 9 7.505 9H7.5q-.074 0-.146.014-.073.015-.141.043-.068.028-.13.07-.061.04-.113.093-.053.052-.094.113-.04.062-.069.13-.028.068-.043.14-.014.073-.014.147zm1.688 0v.006q0 .074.014.146.014.073.043.141.028.068.069.13.04.061.093.113.052.053.114.094.061.04.13.069.068.028.14.043.073.014.146.014h.007q.073 0 .146-.014.072-.015.14-.043.069-.028.13-.07.062-.04.114-.093.052-.052.093-.113.041-.062.07-.13.028-.068.042-.14.014-.073.014-.147V9.75q0-.074-.014-.146-.014-.073-.043-.141-.028-.068-.069-.13-.04-.061-.093-.113-.052-.053-.114-.094-.061-.04-.13-.069-.068-.028-.14-.043Q9.267 9 9.194 9h-.007q-.073 0-.146.014-.072.015-.14.043-.069.028-.13.07-.062.04-.114.093-.052.052-.093.113-.041.062-.07.13-.028.068-.042.14-.014.073-.014.147zm1.687 0v.006q0 .074.014.146.015.073.043.141.028.068.07.13.04.061.093.113.052.053.113.094.062.04.13.069.068.028.14.043.073.014.147.014h.006q.074 0 .146-.014.073-.015.141-.043.068-.028.13-.07.061-.04.113-.093.053-.052.094-.113.04-.062.069-.13.028-.068.043-.14.014-.073.014-.147V9.75q0-.074-.014-.146-.015-.073-.043-.141-.028-.068-.07-.13-.04-.061-.093-.113-.052-.053-.113-.094-.062-.04-.13-.069-.068-.028-.14-.043Q10.954 9 10.88 9h-.006q-.074 0-.146.014-.073.015-.141.043-.068.028-.13.07-.061.04-.113.093-.053.052-.094.113-.04.062-.069.13-.028.068-.043.14-.014.073-.014.147zm-6.75 1.688v.005q0 .074.014.147.015.072.043.14.028.069.07.13.04.062.093.114.052.052.113.093.062.041.13.07.068.028.14.042.073.014.147.014h.006q.074 0 .146-.014.073-.014.141-.043.068-.028.13-.069.061-.04.113-.093.053-.052.094-.114.04-.061.069-.13.028-.068.043-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.015-.072-.043-.14-.028-.069-.07-.13-.04-.062-.093-.114-.052-.052-.113-.093-.062-.041-.13-.07-.068-.028-.14-.042-.073-.014-.147-.014h-.006q-.074 0-.146.014-.073.014-.141.043-.068.028-.13.069-.061.04-.113.093-.053.052-.094.114-.04.061-.069.13-.028.068-.043.14-.014.073-.014.146zm1.688 0v.005q0 .074.014.147.014.072.043.14.028.069.069.13.04.062.093.114.052.052.114.093.061.041.13.07.068.028.14.042.073.014.146.014h.006q.074 0 .147-.014.072-.014.14-.043.069-.028.13-.069.062-.04.114-.093.052-.052.093-.114.041-.061.07-.13.028-.068.042-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.014-.072-.043-.14-.028-.069-.069-.13-.04-.062-.093-.114-.052-.052-.114-.093-.061-.041-.13-.07-.068-.028-.14-.042-.073-.014-.146-.014h-.006q-.074 0-.147.014-.072.014-.14.043-.069.028-.13.069-.062.04-.114.093-.052.052-.093.114-.041.061-.07.13-.028.068-.042.14-.014.073-.014.146zm1.687 0v.005q0 .074.014.147.015.072.043.14.028.069.07.13.04.062.093.114.052.052.113.093.062.041.13.07.068.028.14.042.073.014.147.014h.006q.074 0 .146-.014.073-.014.141-.043.068-.028.13-.069.061-.04.113-.093.053-.052.094-.114.04-.061.069-.13.028-.068.043-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.015-.072-.043-.14-.028-.069-.07-.13-.04-.062-.093-.114-.052-.052-.113-.093-.062-.041-.13-.07-.068-.028-.14-.042-.073-.014-.147-.014H7.5q-.074 0-.146.014-.073.014-.141.043-.068.028-.13.069-.061.04-.113.093-.053.052-.094.114-.04.061-.069.13-.028.068-.043.14-.014.073-.014.146zm1.688 0v.005q0 .074.014.147.014.072.043.14.028.069.069.13.04.062.093.114.052.052.114.093.061.041.13.07.068.028.14.042.073.014.146.014h.007q.073 0 .146-.014.072-.014.14-.043.069-.028.13-.069.062-.04.114-.093.052-.052.093-.114.041-.061.07-.13.028-.068.042-.14.014-.073.014-.146v-.007q0-.073-.014-.146-.014-.072-.043-.14-.028-.069-.069-.13-.04-.062-.093-.114-.052-.052-.114-.093-.061-.041-.13-.07-.068-.028-.14-.042-.073-.014-.146-.014h-.007q-.073 0-.146.014-.072.014-.14.043-.069.028-.13.069-.062.04-.114.093-.052.052-.093.114-.041.061-.07.13-.028.068-.042.14-.014.073-.014.146z"
//                 fillRule="evenodd"
//                 fill="#6B7280"
//               />
//             </svg>
//           </div>
//         </Tippy>
//       )}
//     </FieldWrapper>
//   );
// };

// export default DateField;
