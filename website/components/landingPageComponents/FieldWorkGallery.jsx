import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';
import './FieldWorkGallery.css';

const FieldWorkGallery = () => {
  const fieldWorkData = [
    {
      id: 1,
      image: "https://media.licdn.com/dms/image/v2/D5622AQEha0yIz6Ht1Q/feedshare-shrink_800/feedshare-shrink_800/0/1720683393568?e=1745452800&v=beta&t=XoSXPP1BHwxHy0YV7Rsq8uyJ3pRi92Q62ftoR7GXKwI",
      text: "Front line workers such as Asha workers play a crucial role in not just identifying red flag signs but guiding families that have individuals with neurodevelopmental disabilities to access the right resources. Asha workers, with their deep understanding of local communities, are uniquely positioned to: Promote awareness and provide early intervention guidance.",
      height: 500
    },
    {
      id: 2,
      image: "https://media.licdn.com/dms/image/v2/D5622AQFTzIlIXcbUAg/feedshare-shrink_800/feedshare-shrink_800/0/1723470900946?e=1745452800&v=beta&t=MhBJVgGrp9JIL90ZQSZNTqA-2HiALunBXbR40WJMxm0",
      text: "International Youth Day.",
      height: 300
    },
    {
      id: 3,
      image: "https://media.licdn.com/dms/image/v2/D5622AQHhxU2-jqaR5Q/feedshare-shrink_800/B56ZUkHASgGsAg-/0/1740067576668?e=1745452800&v=beta&t=3PQh9FWYgPX_3yQNcgvqyHqBYVd27q5UghmXeu-4YuE",
      text: "Understanding the challenges parents often encounter when seeking assessments and UDIDs for their children, our second UDID camp",
      height: 400
    },
    {
      id: 4,
      image: "https://media.licdn.com/dms/image/v2/D5622AQFncDr3PE0GpQ/feedshare-shrink_2048_1536/B56ZUkHATTGsAo-/0/1740067576582?e=1745452800&v=beta&t=uZ4zw_TY4iumaZWsVVppHIXDQTYDGktBi-0g_a_THFw",
      text: "UDID Camp !",
      height: 200
    },
    {
      id: 5,
      image: "https://media.licdn.com/dms/image/v2/D5622AQEOGhwVzgmVnw/feedshare-shrink_800/B56ZTjbcOUGUAk-/0/1738982410936?e=1745452800&v=beta&t=sCLKd98NPOELJnHwMJuLVvHpla9JYsq46W1SVskVEYg",
      text: "Screening children for developmental disabilities and counseling of parents",
      height: 380
    },
    {
      id: 6,
      image: "https://media.licdn.com/dms/image/v2/D5622AQGKKgynzJdWfg/feedshare-shrink_800/B56ZSOXkP7GQAg-/0/1737555337374?e=1745452800&v=beta&t=fZvls2sbSfFZKmTKiEGTnWZUUzkXqrlEaZiutoWU3eg",
      text: "Training a group of government school teacher. We are dedicated to empowering individuals with disabilities through training and support",
      height: 400
    },
    {
      id: 7,
      image: "https://media.licdn.com/dms/image/v2/D4E22AQGMS2wzIQEgUw/feedshare-shrink_1280/feedshare-shrink_1280/0/1715853241618?e=1745452800&v=beta&t=Msjot8rOsP5vsdaAlrC3qcUOJJuoZXaZUhCWvs_466I",
      text: "A coding workshop for our students. ",
      height: 300
    },
    {
      id: 8,
      image: "https://media.licdn.com/dms/image/v2/D4E22AQF9s9YJHX6CEA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1715853226894?e=1745452800&v=beta&t=Z8djGBhnhI_L_XcotbVMJw1IHLx0_XNe908_x_-83Rs",
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
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Field Work</h2>
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
              <div 
                className="w-full h-64 bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.image})` }}
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