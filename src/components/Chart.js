import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
};

export default function Chart() {
  const [superAdminCount, setSuperAdminCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const data = {
    labels: ["Super Admin", "Admin", "User"],
    datasets: [
      {
        label: "no. of accounts",
        data: [superAdminCount, adminCount, userCount],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    fetch("http://localhost:3031/api/all-user")
      .then((response) => response.json())
      .then((data) => {
        const super_admin_count = data.filter((u) => u.role === "super_admin");
        setSuperAdminCount(super_admin_count.length);

        const admin_count = data.filter((u) => u.role === "admin");
        setAdminCount(admin_count.length);

        const user_count = data.filter((u) => u.role === "user");
        setUserCount(user_count.length);
      });
  }, []);

  return (
    <>
      <Doughnut data={data} options={options} style={{ display: "inline" }} />
    </>
  );
}
