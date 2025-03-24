import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// const images = [
//   { id: "01", url: "https://media.licdn.com/dms/image/v2/D5622AQH0eHMDapDo6Q/feedshare-shrink_800/B56ZXDJjXgHEAg-/0/1742735818598?e=1745452800&v=beta&t=nSsW8NaLqQ6UekgurumWNLrbO4qzg6dTSiMH2S5brIE" },
//   { id: "02", url: "https://media.licdn.com/dms/image/v2/D5622AQGL7iqVxYn6WQ/feedshare-shrink_1280/B56ZW.StCfGoAk-/0/1742654330969?e=1745452800&v=beta&t=esze32Oce44gzIPZXXBOvO2mofhceuufrwNxI1FjE8s" },
//   { id: "03", url: "https://media.licdn.com/dms/image/v2/D5622AQGsWFurfmvyNw/feedshare-shrink_800/B56ZW5kc0wHEAk-/0/1742575095772?e=1745452800&v=beta&t=1NzxqCGgROhgG93tXOKu7-nKtbjSfULnnpHy8Q4fxKk" },
//   { id: "04", url: "https://media.licdn.com/dms/image/v2/D5622AQGAudEHJXOj6g/feedshare-shrink_800/B56ZW0IzMiHoAg-/0/1742483964490?e=1745452800&v=beta&t=hQPfhX4f0aHTsWcsicVYeRf_3ljl_g5-ZyUPtnJ85VY" },
//   { id: "05", url: "https://media.licdn.com/dms/image/v2/D5622AQGAjVmd4_44eA/feedshare-shrink_800/B56ZW0IzMcHQAg-/0/1742483962948?e=1745452800&v=beta&t=XliHHhY1XDqoyeDLVL-JbVW8hsH_Oz6CcgVMeC6O3kI" },
//   { id: "06", url: "https://media.licdn.com/dms/image/v2/D5622AQE1CkP0pruYdQ/feedshare-shrink_800/B56ZWqA8YsGQAk-/0/1742314135428?e=1745452800&v=beta&t=CP7OEyyc6r_ekhvo9Xp-KDlilkAFlpDtbU0X0dKaghc" },
//   { id: "07", url: "https://media.licdn.com/dms/image/v2/D5622AQFn8dgQWGxPRg/feedshare-shrink_800/B56ZWqA8aUHsAg-/0/1742314135547?e=1745452800&v=beta&t=P7HYmKs_uMeY3_dFoOtmyjzvDVESwTSP0k0zH0rQVxo" },
//   { id: "08", url: "https://media.licdn.com/dms/image/v2/D5622AQECtd37Pz1Mgg/feedshare-shrink_1280/B56ZWqA8agHQAo-/0/1742314135365?e=1745452800&v=beta&t=u2NKcdG7odNt5MOlpzgCwxPulSQ4JLoL0SvR9UeSBlQ" },
//   { id: "09", url: "https://media.licdn.com/dms/image/v2/D5622AQETjGBDT3RH2Q/feedshare-shrink_800/B56ZWknUV4HEAk-/0/1742223527669?e=1745452800&v=beta&t=yBDarLv1C9AoQz-ZinsZTAUE6gQvLEjHGQAPYvbniDg" },
//   { id: "10", url: "https://media.licdn.com/dms/image/v2/D5622AQG0p7ptdzNNqg/feedshare-shrink_800/B56ZWknUVXGoAw-/0/1742223527220?e=1745452800&v=beta&t=p4AMvDdZwIt5nKdorfEpC1DtclGaIEN312ToUfdQdJI" },
// ];
const images = [
  { id: "01", url: "https://images.unsplash.com/photo-1663664418813-67c74966bb68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "02", url: "https://media.istockphoto.com/id/1210533210/photo/closeup-green-leaves-with-blurry-man-wearing-face-mask-protecting-himself-from-air-pollution.webp?a=1&s=612x612&w=0&k=20&c=3SaBVgd23xAlADg1PflDE4V06e0tzQrqOYpQy_Eu5eE=" },
  { id: "03", url: "https://images.unsplash.com/photo-1562878749-649e461a4d58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmdvJTIwc29jaWFsJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: "04", url: "https://plus.unsplash.com/premium_photo-1678132565650-16e5c6f946b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "05", url: "https://images.unsplash.com/photo-1663664418813-67c74966bb68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "06", url: "https://media.istockphoto.com/id/1210533210/photo/closeup-green-leaves-with-blurry-man-wearing-face-mask-protecting-himself-from-air-pollution.webp?a=1&s=612x612&w=0&k=20&c=3SaBVgd23xAlADg1PflDE4V06e0tzQrqOYpQy_Eu5eE=" },
  { id: "07", url: "https://images.unsplash.com/photo-1562878749-649e461a4d58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmdvJTIwc29jaWFsJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: "08", url: "https://plus.unsplash.com/premium_photo-1678132565650-16e5c6f946b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [springProps, api] = useSpring(() => ({ x: 0 }));

  const handleNext = () => {
    if (index < images.length - 5) {
      setIndex(index + 1);
      api.start({ x: -(index + 1) * 200 });
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      api.start({ x: -(index - 1) * 200 });
    }
  };

  return (
    <div className="relative overflow-hidden w-full h-[500px] max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between absolute inset-0 z-10">
        <button onClick={handlePrev} className="text-3xl text-gray-700 hover:text-black">
          <FiChevronLeft />
        </button>
        <button onClick={handleNext} className="text-3xl text-gray-700 hover:text-black">
          <FiChevronRight />
        </button>
      </div>
      <div className="overflow-hidden">
        <animated.div
          style={springProps}
          className="flex space-x-4 transition-transform duration-300"
        >
          {images.map((image) => (
            <div key={image.id} className="flex-shrink-0 w-56">
              <img
                src={image.url}
                alt={`Awareness ${image.id}`}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          ))}
        </animated.div>
      </div>
    </div>
  );
}

export default ImageSlider;
