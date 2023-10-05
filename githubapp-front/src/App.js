import React, { useState } from 'react';
import LanguageList from './LanguageList';
import { searchRepositories, searchUsers } from './api'; // Import the API service
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import { Carousel } from 'react-responsive-carousel';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('repository'); // Default to the repository tab
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [users, setUsers] = useState([]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'repository') {
        const data = await searchRepositories(searchTerm, language);
        setRepositories(data.items); // Assuming your API returns an array of repositories
      } else if (activeTab === 'user') {
        const data = await searchUsers(searchTerm);
        setUsers([data]); // Wrap the user data in an array
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(''); // Clear the search term when switching tabs
    setLanguage(''); // Clear the language when switching tabs
    setRepositories([]); // Clear the repositories when switching tabs
    setUsers([]); // Clear the users when switching tabs
  };



  return (
  <div className="container mx-auto">
    {/* <div className="columns-2">  This is just a comment*/}
      <div className="min-h-screen flex flex-col lg:flex-row items-center lg:justify-center bg-neutral-700">
        <div className="bg-neutral-800 p-8 rounded shadow-lg max-w-md">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center text-center mb-4">
              <img src="../ghlogo.png" style={{ maxWidth: '30%' }}></img>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="flex">
              <button
                className={`${
                  activeTab === 'repository' ? 'bg-neutral-700 text-white' : 'bg-neutral-700 text-white'
                } px-4 py-2 rounded-l hover:bg-orange-400 focus:outline-none`}
                onClick={() => handleTabChange('repository')}
              >
                Repository
              </button>
              <button
                className={`${
                  activeTab === 'user' ? 'bg-neutral-700 text-white' : 'bg-neutral-700 text-white'
                } px-4 py-2 rounded-r hover:bg-orange-400 focus:outline-none`}
                onClick={() => handleTabChange('user')}
              >
                User
              </button>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col">
              <input
                type="text"
                className="border border-white rounded py-2 px-3 focus:outline-none focus:bg-grey mb-2 text-white"
                placeholder={`Enter a ${activeTab === 'repository' ? 'GitHub Repository' : 'GitHub User'}`}
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ backgroundColor: 'rgb(38 38 38)', color: 'white !important' }}
              />
              {activeTab === 'repository' && (
                <input
                  type="text"
                  className="border border-white rounded py-2 px-3 focus:outline-none focus:bg-grey mb-2 text-white"
                  placeholder="Enter a language (optional)"
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ backgroundColor: 'rgb(38 38 38)', color: 'white !important' }}
                />
              )}
              <button
                type="submit"
                className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-orange-400 focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>

          {activeTab === 'repository' && repositories.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-white flex text-center justify-center">Results<span className="material-symbols-outlined" style={{ fontSize: '22px', marginLeft: '7px', color: 'rgb(251 146 60)' }}>rocket_launch</span></h2>
              <hr></hr>
              <Carousel showThumbs={false} showStatus={false} showIndicators={false}>
                {repositories.map((repo) => (
                  <div key={repo.id} className="text-center">
                    <h2 className="text-lg font-semibold mb-4 mt-4" style={{ color: 'rgb(251 146 60)'}}>{repo.name}</h2>
                    <h2 className="text-lg font-semibold mb-4 mt-4 text-white">by: {repo.owner.login}</h2>

                    {/* Display the languages using LanguagesList component */}
                    <LanguageList languagesUrl={repo.languages_url} className="max-h-[20rem]" />

                    <h2 className="text-lg font-semibold mb-4 mt-4 text-white">Description</h2>

                    <p className="text-white text-lig font-semibold mb-4 max-h-[20rem] mt-4">
                      {repo.description && repo.description.length > 140 ? `${repo.description.substring(0, 140)}...` : repo.description}
                    </p>

                    <div className="grid gap-4 grid-cols-2">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <button
                          type="submit"
                          className="bg-neutral-700 text-white px-4 py-2 rounded hover-bg-orange-400 focus:outline-none"
                        >
                          Repository
                        </button>
                      </a>
                      <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">
                        <button
                          type="submit"
                          className="bg-neutral-700 text-white px-4 py-2 rounded hover-bg-orange-400 focus:outline-none"
                        >
                          Owner
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}


          {activeTab === 'user' && users.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-white flex text-center justify-center">Results<span className="material-symbols-outlined" style={{ fontSize: '22px', marginLeft: '7px', color: 'rgb(251 146 60)' }}>rocket_launch</span></h2>
              <hr></hr>
              <ul>
                {users.map((user) => (
                  <div key={user.id}>

                    <div className="flex justify-center mt-4">
                      <img className="max-w-sm" src={user.avatar_url} alt="User Avatar"/>
                    </div>
                    <h2 className="text-lg font-semibold mb-4 mt-4 flex justify-center" style={{ color: 'rgb(251 146 60)' }}>{user.login}</h2>

                    <p className="text-white text-lig font-semibold mb-4 flex justify-center">
                      {user.bio}
                    </p>


                    <div className="columns-2">
                      <div>
                        <h2 className="text-lg font-semibold mb-4 flex justify-center text-white">Repositories</h2>
                        <h3 className="text-lg font-semibold mb-4 flex justify-center text-white"> {user.public_repos}</h3>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-4 flex justify-center text-white">Followers</h2>
                        <h3 className="text-lg font-semibold mb-4 flex justify-center text-white">{user.followers}</h3>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="columns-2 mt-4">
                      <a href={user.type === 'User' ? `https://github.com/${user.login}?tab=repositories` : `https://github.com/orgs/${user.login}/repositories`} target="_blank" rel="noopener noreferrer" className='flex justify-center'>
                        <button
                          type="submit"
                          className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-orange-400 focus:outline-none"
                        >
                          Repositories
                        </button>
                      </a>
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className='flex justify-center'>
                        <button
                          type="submit"
                          className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-orange-400 focus:outline-none"
                        >
                          Profile
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>


  </div>
  );
}


export default App;