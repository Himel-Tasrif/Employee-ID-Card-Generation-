import React, { useState, useRef } from 'react';
import { Upload, User, Briefcase, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EmployeeData {
  name: string;
  photo: string;
  role: 'PCA' | 'HHA' | 'RN' | '';
}

function App() {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    name: '',
    photo: '',
    role: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployeeData(prev => ({ ...prev, role: e.target.value as EmployeeData['role'] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmployeeData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStaffType = (role: string) => {
    if (role === 'RN') return 'MEDICAL STAFF';
    if (role === 'PCA' || role === 'HHA') return 'NON-MEDICAL STAFF';
    return '';
  };

  const downloadIDCard = async () => {
    if (!idCardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${employeeData.name || 'employee'}_id_card.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const printIDCard = async () => {
    if (!idCardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85.6, 54] // Standard ID card size
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
      pdf.save(`${employeeData.name || 'employee'}_id_card.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormComplete = employeeData.name && employeeData.photo && employeeData.role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
            Employee ID Card Generator
          </h1>
          <p className="text-gray-300">Create professional ID cards for Axzons HomeCare staff</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-purple-400 flex items-center">
              <User className="mr-3" />
              Employee Information
            </h2>
            
            <div className="space-y-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <User className="inline w-4 h-4 mr-2" />
                  Employee Name
                </label>
                <input
                  type="text"
                  value={employeeData.name}
                  onChange={handleNameChange}
                  placeholder="Enter employee full name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Upload className="inline w-4 h-4 mr-2" />
                  Employee Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-green-600 file:text-white hover:file:from-purple-700 hover:file:to-green-700 transition-all duration-200"
                />
                {employeeData.photo && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={employeeData.photo}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-purple-500 shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Briefcase className="inline w-4 h-4 mr-2" />
                  Role Selection
                </label>
                <select
                  value={employeeData.role}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                >
                  <option value="">Select a role</option>
                  <option value="PCA">PCA - Personal Care Assistant</option>
                  <option value="HHA">HHA - Home Health Aide</option>
                  <option value="RN">RN - Registered Nurse</option>
                </select>
                {employeeData.role && (
                  <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-300">
                      Staff Type: <span className="text-green-400 font-semibold">{getStaffType(employeeData.role)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isFormComplete && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={downloadIDCard}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {isGenerating ? 'Generating...' : 'Download PNG'}
                  </button>
                  <button
                    onClick={printIDCard}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    {isGenerating ? 'Generating...' : 'Print PDF'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ID Card Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                ref={idCardRef}
                className="bg-white text-black rounded-2xl shadow-2xl overflow-hidden relative" 
                style={{ width: '350px', height: '550px' }}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 opacity-10 rounded-br-full"></div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-green-500 to-green-600 opacity-10 rounded-bl-full"></div>
                
                {/* ID Card Content */}
                <div className="h-full flex flex-col relative">
                  {/* Company Logo */}
                  <div className="text-center py-6 px-4 relative">
                    <div className="text-4xl font-bold">
                      <span className="text-purple-700">A</span>
                      <span className="text-green-500">x</span>
                      <span className="text-green-500">z</span>
                      <span className="text-purple-700">o</span>
                      <span className="text-purple-700">n</span>
                      <span className="text-purple-700">s</span>
                    </div>
                    <div className="text-purple-700 text-lg font-medium -mt-1">HomeCare</div>
                  </div>

                  {/* Employee Photo */}
                  <div className="flex justify-center px-4 mb-4">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-4 border-white shadow-lg relative">
                      {employeeData.photo ? (
                        <img
                          src={employeeData.photo}
                          alt="Employee"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={60} />
                        </div>
                      )}
                      {/* Photo frame effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/20"></div>
                    </div>
                  </div>

                  {/* Employee Name */}
                  <div className="text-center px-4 mb-2">
                    <div className="text-purple-700 text-2xl font-bold uppercase tracking-wider leading-tight">
                      {employeeData.name || 'EMPLOYEE NAME'}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="text-center px-4 mb-1">
                    <div className="text-gray-700 text-2xl font-bold">
                      {employeeData.role || 'ROLE'}
                    </div>
                  </div>

                  {/* Staff Type */}
                  <div className="text-center px-4 mb-6">
                    <div className="text-gray-600 text-sm font-semibold">
                      {getStaffType(employeeData.role) || 'STAFF TYPE'}
                    </div>
                  </div>

                  {/* Separator Line with gradient */}
                  <div className="mx-4 mb-6 relative">
                    <div className="h-1 bg-gradient-to-r from-purple-600 via-green-500 to-purple-600 rounded-full"></div>
                    <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                  </div>

                  {/* Contact Information */}
                  <div className="flex-1 px-4 text-center space-y-2">
                    <div className="text-gray-600 text-xs font-semibold leading-tight">
                      70 EAST SUNRISE HIGHWAY,
                    </div>
                    <div className="text-gray-600 text-xs font-semibold leading-tight mb-3">
                      SUITE 500 VALLEY STREAM, NY 11581
                    </div>
                    
                    <div className="text-purple-700 text-base font-bold mb-2">
                      866-429-9667
                    </div>
                    
                    <div className="text-gray-600 text-xs font-semibold mb-4">
                      WWW.AXZONSHOMECARE.COM
                    </div>
                  </div>

                  {/* Bottom decorative element */}
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[32px] border-l-transparent border-b-[32px] border-b-purple-700"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[24px] border-r-transparent border-b-[24px] border-b-green-500 opacity-60"></div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-2xl blur-xl -z-10 scale-105"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;