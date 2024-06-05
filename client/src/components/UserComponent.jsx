import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

const UserComponent = () => {

  const { users } = useContext(UserContext)


  console.log(users)
  return (

    <div className="overflow-x-auto container mx-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-lg">

        <thead className="bg-secondary-bg">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Change password</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Delete User</th>
          </tr>
        </thead>






        {users.map((user) => (
          <div key={user.id}>
            <tbody className='bg-custom-bg divide-y divide-secondary-bg'>
              <tr>

                <td>
                  {user.username}
                </td>
                <td>
                  {user.fullname}
                </td>
              </tr>
            </tbody>
          </div>

        ))
        }


      </table >
    </div>
  )
}







export default UserComponent