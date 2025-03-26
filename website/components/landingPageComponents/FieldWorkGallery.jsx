import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

const FieldWorkGallery = () => {
  const fieldWorkData = [
    {
      id: 1,
      image: "/assets/imagesLanding/FieldWork/Asha Workers.jpeg",
      text: "Front line workers such as Asha workers play a crucial role in not just identifying red flag signs but guiding families that have individuals with neurodevelopmental disabilities to access the right resources. Asha workers, with their deep understanding of local communities, are uniquely positioned to: Promote awareness and provide early intervention guidance.",
      height: 500
    },
    {
      id: 2,
      image: "/assets/imagesLanding/FieldWork/Youth Day.jpeg",
      text: "International Youth Day.",
      height: 300
    },
    {
      id: 3,
      image: "/assets/imagesLanding/FieldWork/UDID.jpeg",
      text: "Understanding the challenges parents often encounter when seeking assessments and UDIDs for their children, our second UDID camp",
      height: 400
    },
    {
      id: 4,
      image: "/assets/imagesLanding/FieldWork/UDID2.jpeg",
      text: "UDID Camp !",
      height: 200
    },
    {
      id: 5,
      image: "/assets/imagesLanding/FieldWork/Interaction.jpeg",
      text: "Screening children for developmental disabilities and counseling of parents",
      height: 380
    },
    {
      id: 6,
      image: "/assets/imagesLanding/FieldWork/Teacher Training.jpeg",
      text: "Training a group of government school teacher. We are dedicated to empowering individuals with disabilities through training and support",
      height: 400
    },
    {
      id: 7,
      image: "/assets/imagesLanding/FieldWork/Coding1.jpeg",
      text: "A coding workshop for our students. ",
      height: 300
    },
    {
      id: 8,
      image: "/assets/imagesLanding/FieldWork/Coding2.jpeg",
      text: "The main focus was on developing problem-solving skills and enhancing cognitive abilities.",
      height: 350
    }
  ];

  const [columns, setColumns] = useState(3);
  const [width, setWidth] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1500) {
        setColumns(4);
      } else if (window.innerWidth >= 1000) {
        setColumns(3);
      } else if (window.innerWidth >= 600) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    const handleResize = () => {
      updateColumns();
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0);
    let gridItems = fieldWorkData.map((child) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columns) * column;
      const y = (heights[column] += child.height) - child.height;
      return { ...child, x, y, width: width / columns - 16, height: child.height };
    });
    return [heights, gridItems];
  }, [columns, width, fieldWorkData]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0, scale: 0.8 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1, scale: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0, scale: 0.8 },
    config: { mass: 1, tension: 280, friction: 60 },
    trail: 80,
  });

  return (
    <div className=" py-8 px-4 max-w-6xl mx-auto">
       <h2 className="text-5xl font-bold text-gray-700 mt-20 my-12 text-center animate-fade-down">
          Field Work
        </h2>
      <div 
        ref={ref} 
        className="relative" 
        style={{ height: Math.max(...heights) + 20 }}
      >
        {transitions((style, item) => (
          <a.div
            style={{
              ...style,
              position: 'absolute',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl">
              {/* <div 
                className="w-full h-64 bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.image})` }}
              /> */}
               <img 
      src={item.image} 
      alt="Field work" 
      className="w-full object-cover" 
      style={{ height: `${item.height}px` }} 
    />
              <div className="p-4 flex-grow">
                <p className="text-gray-700 text-sm">{item.text}</p>
              </div>
            </div>
          </a.div>
        ))}
      </div>
    </div>
  );
};

export default FieldWorkGallery;