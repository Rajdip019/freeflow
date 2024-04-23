# Freeflow

### Introduction:
Freeflow is a platform designed to streamline the workflow for designers and their teams. It provides a collaborative workspace where designers can upload, manage, and share their designs seamlessly. With features such as easy design uploads, design management, and sharing links for feedback, Freeflow aims to enhance the design process and improve team collaboration.

**Features:**

1. **Workspace Creation:** Designers can create workspaces where they can organize their projects and collaborate with their teammates.

2. **Team Collaboration:** Designers can invite teammates to their workspaces, enabling seamless collaboration on design projects.

3. **Design Upload:** Users can easily upload their designs to the platform, making it convenient to share and manage design assets.

4. **Design Management:** Freeflow provides tools for managing designs within workspaces, including categorization, version control, and annotations.

5. **Public Sharing:** Designers can generate shareable links to their designs, allowing them to gather feedback from stakeholders or the public easily.

**Technology Stack:**

reeflow is built using Next.js, a React framework for server-side rendering, providing a fast and responsive user experience. Firebase Firestore serves as the database for Freeflow, offering real-time data synchronization and scalability for handling large volumes of design data.

## **Contribution Guidelines:**

We welcome contributions from the community to enhance Freeflow and make it even more powerful for designers and teams. Here's a step-by-step guide on how to contribute:

**1. Run Freeflow Locally:**

To get started, you'll need to set up Freeflow on your local machine. Follow these steps:

- **Clone the Repository:** Start by cloning the Freeflow repository to your local machine using the following command:
  ```
  git clone https://github.com/Rajdip019/freeflow.git
  ```

- **Install Dependencies:** Navigate to the project directory and install the necessary dependencies using npm or yarn:
  ```
  cd freeflow
  npm install
  ```

- **Set Up Firebase:** Since Freeflow uses Firebase Firestore as the backend, you'll need to set up a Firebase project and obtain your Firebase configuration. Follow the Firebase documentation for instructions on how to set up Firebase for web apps.

- **Update Environment Variables:** Create a `.env.local` file in the root directory of the project and add your Firebase configuration details. This file should include variables such as `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and other necessary environment variables.

- **Start the Development Server:** Once Firebase is set up and your environment variables are updated, start the development server:
  ```
  npm run dev
  ```

- **Access Freeflow:** Open your web browser and navigate to `http://localhost:3000` to access Freeflow running locally on your machine.

**2. Make Changes and Push to Your Fork:**

Now that you have Freeflow running locally, you can make changes or additions to the codebase. Follow these steps:

- **Create a Branch:** Before making any changes, create a new branch to work on your feature or bug fix:
  ```
  git checkout -b feature-name
  ```

- **Implement Changes:** Make your desired changes or additions to the codebase. Ensure that your code follows the project's coding standards and conventions.

- **Test Your Changes:** Before pushing your changes, test them locally to ensure they work as expected and do not introduce any regressions.

- **Commit Your Changes:** Once you're satisfied with your changes, commit them to your branch with descriptive commit messages:
  ```
  git add .
  git commit -m "Add feature XYZ"
  ```

- **Push Changes to Your Fork:** Push your commits to your forked repository on GitHub:
  ```
  git push origin feature-name
  ```

**3. Update Your Fork:**

Periodically, you may want to update your fork with the latest changes from the main Freeflow repository. Follow these steps to keep your fork up to date:

- **Add Upstream Remote:** Add the main Freeflow repository as an upstream remote:
  ```
  git remote add upstream https://github.com/Rajdip019/freeflow.git
  ```

- **Fetch Changes:** Fetch the latest changes from the upstream repository:
  ```
  git fetch upstream
  ```

- **Merge Changes:** Merge the changes from the upstream repository into your local master branch:
  ```
  git checkout master
  git merge upstream/master
  ```

- **Push Changes to Your Fork:** Push the updated master branch to your forked repository:
  ```
  git push origin master
  ```

**Code of Conduct:**

Please note that we have a code of conduct in place to ensure a welcoming and inclusive community for all contributors. Be respectful and considerate towards others, regardless of background or experience. Harassment or abusive behavior will not be tolerated.

**Get Started:**

Ready to start contributing to Freeflow? Head over to our GitHub repository and fork the project today!


[GitHub Repository Link](https://github.com/Rajdip019/freeflow)

We look forward to your contributions and thank you for helping us make Freeflow the best platform for designers and teams!


<h2 align='center'> Project maintainers </h2>
<table align='center'>
<tr>
    <td align="center">
        <a href="https://github.com/Rajdip019">
            <img src="https://avatars.githubusercontent.com/u/91758830?v=4" width="100;" alt="Debajyoti Saha"/>
            <br />
            <sub><b>Rajdeep Sengupta</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/mukeshkuiry">
            <img src="https://avatars.githubusercontent.com/u/99157367?v=4" width="100;" alt="Mukesh Kuiry"/>
            <br />
            <sub><b>Mukesh Kuiry</b></sub>
        </a>
    </td>
  </tr>
</table>
