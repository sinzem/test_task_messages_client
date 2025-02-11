import localFont from "next/font/local"

export const sansDM = localFont({
  src: [
    {
      path: "../../public/fonts/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
        path: "../../public/fonts/DMSans-Bold.ttf",
        weight: "700",
        style: "normal",
      },
  ],
  variable: "--sansDM",
})

export const sansPub = localFont({
  src: "../../public/fonts/PublicSans-Regular.ttf",
  variable: "--sansPub",
})
