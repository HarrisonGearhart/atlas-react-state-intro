import { useState, useEffect } from "react";

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: null, direction: "asc" });

  // Fetch courses on component mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses.json");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }
    fetchCourses();
  }, []);

  // Handle sorting when header clicked
  const handleSortClick = (column) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  };

  // Filter courses based on search query
  const filterCourses = (courseList) => {
    if (!searchQuery) return courseList;
    return courseList.filter((course) =>
      course.courseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Sort courses based on sortConfig
  const sortCourses = (courseList) => {
    const { column, direction } = sortConfig;
    if (!column) return courseList;

    return [...courseList].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const displayedCourses = sortCourses(filterCourses(courses));

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search courses"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Courses table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortClick("trimester")}>Trimester</th>
            <th onClick={() => handleSortClick("courseNumber")}>Course Number</th>
            <th onClick={() => handleSortClick("courseName")}>Course Name</th>
            <th onClick={() => handleSortClick("semesterCredits")}>Semester Credits</th>
            <th onClick={() => handleSortClick("totalClockHours")}>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {displayedCourses.map((course, index) => (
            <tr key={index}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination placeholder */}
      <div className="pagination">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
}
