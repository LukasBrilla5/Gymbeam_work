import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import './styles.css';
import { FaBars, FaTimes } from 'react-icons/fa';

interface Filter {
  name: string;
  options?: Array<{ id: string; name: string }>;
  type?: string;
  min?: number;
  max?: number;
}

interface SidebarProps {
  filters: Filter[];
  selectedFilters: { [key: string]: any };
  handleFilterChange: (filterName: string, value: any) => void;
}

const MySidebar: React.FC<SidebarProps> = ({ filters, selectedFilters, handleFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);

 

  const checkIfMobile = () => {
    const isMobileDevice = /Mobi/i.test(navigator.userAgent); 
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
    return isMobileDevice && screenWidth <= 768; 
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };


    setIsMobile(checkIfMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    if(!isMobile){
      setIsOpen(true);
    }
          
  }, [isMobile]);

  const toggleSidebar = () => {

    setIsOpen(!isOpen); 
  };

  if(isOpen){

  return (
    <div >
      {isMobile && ( 
        <div className={`toggle-sidebar-button ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      )}

      <Sidebar
         style={{ visibility: isOpen  ? 'visible' : 'hidden' }}
        className="custom-sidebar"
      >
        <Menu>
          {filters.map((filter, index) => (
            <SubMenu key={index} label={filter.name}>
              {filter.type === 'range' ? (
                <div className="range-filter">
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    value={selectedFilters[filter.name] || filter.min}
                    onChange={(e) => handleFilterChange(filter.name, parseInt(e.target.value))}
                  />
                  <span>{selectedFilters[filter.name]}</span>
                </div>
              ) : (
                filter.options?.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => handleFilterChange(filter.name, option.name)}
                    active={selectedFilters[filter.name] === option.name}
                  >
                    {option.name}
                  </MenuItem>
                ))
              )}
            </SubMenu>
          ))}
        </Menu>
      </Sidebar>
    </div>
  );
}
else{
  return(
    <div>
      {isMobile && ( 
        <div className={`toggle-sidebar-button ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      )}
    </div>
  )
}
};


export default MySidebar;
