// import React from "react";
// import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
// import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
// import { Chart as ChartJs } from "react-chartjs-2";

// // Simplified Card component
// const Card = () => {
//     return (
//         <Box
//             p="6"
//             border=".1px solid"
//             borderColor="gray.50"
//             overflow="hidden"
//             borderRadius="10"
//             background="white"
//         >
//         </Box>
//     );
// };

// // Addexpense component
// const Addexpense = () => {
//     const expense = 500;
//     const income = 1000;

//     return (
//         <Card mt="9" display="flex">
//             <Heading size="sm" color="gray.700">
//                 Reports
//             </Heading>
//             <Flex
//                 w="full"
//                 justifyContent="center"
//                 alignItems="center"
//                 flexDirection={{
//                     base: "column",
//                     sm: "column",
//                     md: "column",
//                     lg: "row",
//                     xl: "row",
//                 }}
//             >
//                 <Box
//                     flex={1}
//                     mt="10"
//                     ml={{ base: 0, lg: -20 }}
//                     mr="4"
//                     width="300px"
//                     height="300px"
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                 >
//                     <ChartJs
//                         data={{
//                             labels: ["Income", "Expense"],
//                             datasets: [
//                                 {
//                                     data: [income, expense],
//                                     backgroundColor: ["#48BB78", "#F56565"],
//                                 },
//                             ],
//                         }}
//                         type="doughnut"
//                     />
//                 </Box>
//                 <Flex
//                     flex={1}
//                     w="full"
//                     flexDirection="column"
//                     alignItems="center"
//                     justifyContent="space-evenly"
//                     ml={{ base: 0, lg: -6 }}
//                     mr="2"
//                 >
//                     <Heading size="md" mb="4" color="gray.700">
//                         Your Balance $ {income - expense}
//                     </Heading>
//                     <Flex
//                         justifyContent="space-evenly"
//                         alignItems="center"
//                         bg="gray.50"
//                         w={["full", "full", "full", "80%", "80%"]}
//                         h="100px"
//                         border="1px solid"
//                         borderColor="gray.100"
//                     >
//                         <IoMdArrowRoundUp color="#48BB78" fontSize="30px" />
//                         <Flex flexDirection="column">
//                             <Heading color="gray.700">$ {income}</Heading>
//                             <Text color="gray.500">Total Income</Text>
//                         </Flex>
//                     </Flex>
//                     <Flex
//                         justifyContent="space-evenly"
//                         alignItems="center"
//                         bg="gray.50"
//                         w={["full", "full", "full", "80%", "80%"]}
//                         h="100px"
//                         mt="3"
//                         border="1px solid"
//                         borderColor="gray.100"
//                     >
//                         <IoMdArrowRoundDown color="#F56565" fontSize="30px" />
//                         <Flex flexDirection="column">
//                             <Heading color="gray.700">$ {expense}</Heading>
//                             <Text color="gray.500">Total Expense</Text>
//                         </Flex>
//                     </Flex>
//                 </Flex>
//             </Flex>
//         </Card>
//     );
// };

// export default Addexpense;
import React from 'react'

function Addexpense() {
    return (
        <div>

        </div>
    )
}

export default Addexpense
