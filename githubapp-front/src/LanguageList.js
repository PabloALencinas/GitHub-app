import { useEffect, useState } from 'react';

const LanguageList = ({ languagesUrl }) => {
    const [languages, setLanguages] = useState({});
    const [totalBytes, setTotalBytes] = useState(0);
  
    useEffect(() => {
      const fetchLanguages = async () => {
        try {
          const response = await fetch(languagesUrl);
          if (response.ok) {
            const data = await response.json();
            setLanguages(data);
  
            // Calculate the total bytes
            const total = Object.values(data).reduce((acc, bytes) => acc + bytes, 0);
            setTotalBytes(total);
          }
        } catch (error) {
          console.error('Error fetching languages:', error);
        }
      };
  
      fetchLanguages();
    }, [languagesUrl]);
  
    return (
        <div className="mb-4 mt-4 gap-4">
          <ul>
            {Object.entries(languages)
              .slice(0, 3) // Take the first 6 entries
              .map(([language, bytes]) => (
                <li key={language} className="text-white mb-2">
                  {language}: ({((bytes / totalBytes) * 100).toFixed(2)}%)
                  <div style={{ width: `${(bytes / totalBytes) * 100}%`, backgroundColor: 'rgb(249 115 22)', height: '5px' }}></div>
                </li>
              ))}
          </ul>
        </div>
    );
};

export default LanguageList;