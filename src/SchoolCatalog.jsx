import { useState, useEffect } from "react";

const PAGE_SIZE = 5;

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ column: null, direction: "asc" });
  const [page, setPage] = useState(1);

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

  // Handle sorting
  const handleSortClick = (column) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  };

  // Filter by search query
  const filterCourses = (courseList) => {
    if (!searchQuery) return courseList;
    return courseList.filter(
      (course) =>
        course.courseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Sort courses
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

  // Combine filter + sort
  const processedCourses = sortCourses(filterCourses(courses));

  // Pagination logic
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPage = processedCourses.slice(startIndex, startIndex + PAGE_SIZE);
  const hasNext = processedCourses.length > page * PAGE_SIZE;
  const hasPrev = page > 1;

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search courses"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1); // Reset page when search changes
        }}
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
          {currentPage.map((course, index) => (
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

      {/* Pagination */}
      <div className="pagination">
        <button disabled={!hasPrev} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span> Page {page} </span>
        <button disabled={!hasNext} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
