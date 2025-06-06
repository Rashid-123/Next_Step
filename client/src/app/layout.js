
// import { Open_Sans } from "next/font/google";
// import "./globals.css";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { AuthProvider } from "@/context/AuthContext";
// import { Toaster } from "react-hot-toast";
// import { LeetCodeProvider } from "@/context/LeetCodeContext";

// const openSans = Open_Sans({
//   variable: "--font-open-sans",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={openSans.variable}>
//       <body className="antialiased font-sans min-h-screen flex flex-col">
//         <LeetCodeProvider>
//           <AuthProvider>
//             <Navbar />
//             <Toaster
//               position="bottom-right"
//               toastOptions={{
//                 className: "",
//                 duration: 3000,
//                 style: {
//                   fontSize: "16px",
//                   fontWeight: "500",
//                   border: "1px solid #ccc",
//                   padding: "16px",
//                 },
//               }}
//             />
            
//             {/* Main content area that grows to fill available space */}
//             <main className="flex-1 pt-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.footer))]">
//               {children}
//             </main>
            
//             <Footer />
//           </AuthProvider>
//         </LeetCodeProvider>
//       </body>
//     </html>
//   );
// }

import { Open_Sans, Orbitron } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { LeetCodeProvider } from "@/context/LeetCodeContext";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${openSans.variable} ${orbitron.variable}`}>
      <body className="antialiased font-sans min-h-screen flex flex-col">
        <LeetCodeProvider>
          <AuthProvider>
            <Navbar />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "",
                duration: 3000,
                style: {
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "1px solid #ccc",
                  padding: "16px",
                },
              }}
            />
            
            {/* Main content area that grows to fill available space */}
            <main className="flex-1 pt-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.footer))]">
              {children}
            </main>
            
            <Footer />
          </AuthProvider>
        </LeetCodeProvider>
      </body>
    </html>
  );
}