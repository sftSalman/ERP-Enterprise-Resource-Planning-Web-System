import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from "@/utils/axios";
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EmployeeNode from '../../components/employees/EmployeeNode'; // Import the custom node component

const nodeTypes = {
  employee: EmployeeNode,
};

const OrgChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const fetchData = async () => {
    const resourceUrl = 'employees/chart';
    axios.get(`/${resourceUrl}`)
      .then((res) => {
        console.log('data', res.data);
        transformDataToFlow(res.data);
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const transformDataToFlow = (data) => {
    const nodes = [];
    const edges = [];
    const employeeMap = {}; // To keep track of already created employee nodes

    let currentYPosition = 0; // Track Y position to vertically stack divisions
    const divisionSpacing = 100; // Vertical spacing between divisions

    data.forEach((division, divisionIndex) => {
      const divisionId = `division-${division.id}`;
      nodes.push({
        id: divisionId,
        data: { label: division.name },
        position: { x: 0, y: currentYPosition }, // All divisions stay in the same column
      });

      // Connect each division to the next one with an edge (vertical connection)
      if (divisionIndex > 0) {
        const previousDivisionId = `division-${data[divisionIndex - 1].id}`;
        edges.push({
          id: `e-${previousDivisionId}-${divisionId}`,
          source: previousDivisionId,
          target: divisionId,
          type: 'straight', // or 'smoothstep' if you prefer curved lines
        });
      }

      // Calculate the maximum height for this division
      let maxDivisionHeight = 0;

      // Add employees directly under the division
      division.employees?.forEach((employee, employeeIndex) => {
        const employeeId = `employee-${employee.id}`;

        // Check if employee node is already created
        if (!employeeMap[employeeId]) {
          nodes.push({
            id: employeeId,
            data: { label: employee.first_name + ' ' + employee.last_name, image: employee.avatar },
            position: { x: 200, y: currentYPosition + employeeIndex * 100 }, // Employees column relative to the division node
            type: 'employee',
          });
          employeeMap[employeeId] = employeeId; // Mark this employee as created
        }

        // Add edge from division to employee
        edges.push({
          id: `e-${divisionId}-${employeeId}`,
          source: divisionId,
          target: employeeId,
          type: 'smoothstep',
        });

        // Update max height based on employee position
        maxDivisionHeight = Math.max(maxDivisionHeight, employeeIndex * 100 + 100);
      });

      division.subdivisions.forEach((subdivision, subdivisionIndex) => {
        const subdivisionId = `subdivision-${subdivision.id}`;
        nodes.push({
          id: subdivisionId,
          data: { label: subdivision.name },
          position: { x: 200, y: currentYPosition + (subdivisionIndex + 1) * 150 }, // Subdivisions column relative to the division node
        });
        edges.push({
          id: `e-${divisionId}-${subdivisionId}`,
          source: divisionId,
          target: subdivisionId,
          type: 'smoothstep',
        });

        // Update max height based on subdivision position
        maxDivisionHeight = Math.max(maxDivisionHeight, (subdivisionIndex + 1) * 150 + 150);

        // Add employees under subdivision
        subdivision.employees?.forEach((employee, employeeIndex) => {
          const employeeId = `employee-${employee.id}`;

          if (!employeeMap[employeeId]) {
            nodes.push({
              id: employeeId,
              data: { label: employee.first_name + ' ' + employee.last_name, image: employee.avatar },
              position: { x: 400, y: currentYPosition + (subdivisionIndex + 1) * 150 + employeeIndex * 100 }, // Employees column relative to the subdivision node
              type: 'employee',
            });
            employeeMap[employeeId] = employeeId;
          }

          edges.push({
            id: `e-${subdivisionId}-${employeeId}`,
            source: subdivisionId,
            target: employeeId,
            type: 'smoothstep',
          });

          // Update max height based on employee position
          maxDivisionHeight = Math.max(maxDivisionHeight, (subdivisionIndex + 1) * 150 + employeeIndex * 100 + 100);
        });

        subdivision.child_divisions?.forEach((childDivision, childDivisionIndex) => {
          const childDivisionId = `childDivision-${childDivision.id}`;
          nodes.push({
            id: childDivisionId,
            data: { label: childDivision.name },
            position: { x: 350, y: currentYPosition + (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 }, // Child divisions column
          });
          edges.push({
            id: `e-${subdivisionId}-${childDivisionId}`,
            source: subdivisionId,
            target: childDivisionId,
            type: 'smoothstep',
          });

          // Update max height based on child division position
          maxDivisionHeight = Math.max(maxDivisionHeight, (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 + 250);

          childDivision.employees?.forEach((employee, employeeIndex) => {
            const employeeId = `employee-${employee.id}`;

            if (!employeeMap[employeeId]) {
              nodes.push({
                id: employeeId,
                data: { label: employee.first_name + ' ' + employee.last_name, image: employee.avatar },
                position: { x: 600, y: currentYPosition + (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 + employeeIndex * 100 }, // Employees column
                type: 'employee',
              });
              employeeMap[employeeId] = employeeId;
            }

            edges.push({
              id: `e-${childDivisionId}-${employeeId}`,
              source: childDivisionId,
              target: employeeId,
              type: 'smoothstep',
            });

            // Update max height based on employee position
            maxDivisionHeight = Math.max(maxDivisionHeight, (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 + employeeIndex * 100 + 100);
          });

          childDivision.departments.forEach((department, departmentIndex) => {
            const departmentId = `department-${department.id}`;
            nodes.push({
              id: departmentId,
              data: { label: department.name },
              position: { x: 600, y: currentYPosition + (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 + (departmentIndex + 1) * 100 }, // Departments column
            });
            edges.push({
              id: `e-${childDivisionId}-${departmentId}`,
              source: childDivisionId,
              target: departmentId,
              type: 'smoothstep',
            });

            department.employees.forEach((employee, employeeIndex) => {
              const employeeId = `employee-${employee.id}`;

              if (!employeeMap[employeeId]) {
                nodes.push({
                  id: employeeId,
                  data: { label: employee.first_name + ' ' + employee.last_name, image: employee.avatar },
                  position: { x: 800, y: currentYPosition + (subdivisionIndex + 1) * 150 + (childDivisionIndex + 1) * 250 + (departmentIndex + 1) * 100 + employeeIndex * 100 }, // Employees column
                  type: 'employee',
                });
                employeeMap[employeeId] = employeeId;
              }

              edges.push({
                id: `e-${departmentId}-${employeeId}`,
                source: departmentId,
                target: employeeId,
                type: 'smoothstep',
              });
            });
          });
        });
      });

      // Increment Y position for the next division hierarchy
      currentYPosition += maxDivisionHeight + divisionSpacing; // Move to next position considering the max height of current division and spacing
    });

    setNodes(nodes);
    setEdges(edges);
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);


  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    // Capture the chart section as a canvas
    const canvas = await html2canvas(printRef.current, {
      useCORS: true, // Enable CORS if the chart contains images from different origins
      scrollX: 0,
      scrollY: -window.scrollY, // Adjust for scrolling
    });

    // Get dimensions of the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Define the maximum dimensions for the PDF page
    const maxPageWidth = 210; // A4 width in mm
    const maxPageHeight = 297; // A4 height in mm

    // Calculate the scaling factor to fit the canvas into the PDF
    const widthRatio = maxPageWidth / (canvasWidth * 0.75); // 0.75 converts px to pt
    const heightRatio = maxPageHeight / (canvasHeight * 0.75);
    const scale = Math.min(widthRatio, heightRatio);

    // Calculate new dimensions for the PDF
    const widthInPoints = canvasWidth * 0.75 * scale;
    const heightInPoints = canvasHeight * 0.75 * scale;

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait', // Change orientation based on your preference
      unit: 'pt',
      format: [widthInPoints, heightInPoints], // Use the calculated dimensions
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png');

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, widthInPoints, heightInPoints);

    // Save the PDF
    pdf.save('org-chart.pdf');
  };

  const edgeTypes = {
    custom: {
      style: {
        stroke: '#000000', // Darker color for the edge lines
        strokeWidth: 2, // Adjust the thickness if needed
      },
      arrowHeadType: 'arrow', // Optionally add arrowheads if desired
    },
  };



  return (
    <div>
      <div className="flex justify-end p-4 space-x-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download as PDF
        </button>
      </div>

      <div ref={printRef} className="h-[400vh]"> {/* Increased height */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};

export default OrgChart;
