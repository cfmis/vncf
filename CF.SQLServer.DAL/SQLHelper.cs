using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.InteropServices;
using System.Configuration;
using CF.Core.Config;

namespace CF.SQLServer.DAL
{
    public abstract class SQLHelper
    {
        public static SqlConnection Conn;
        public static readonly string strCon = CachedConfigContext.Current.DaoConfig.Crm;

        protected SQLHelper()
        {
        }

        private static SqlCommand BuildIntCommand(SqlConnection connection, string storedProcName, IDataParameter[] parameters)
        {
            SqlCommand command = BuildQueryCommand(connection, storedProcName, parameters);
            command.Parameters.Add(new SqlParameter("ReturnValue", SqlDbType.Int, 4, ParameterDirection.ReturnValue, false, 0, 0, string.Empty, DataRowVersion.Default, null));
            return command;
        }

        private static SqlCommand BuildQueryCommand(SqlConnection connection, string storedProcName, IDataParameter[] parameters)
        {
            SqlCommand command = new SqlCommand(storedProcName, connection);
            command.CommandType = CommandType.StoredProcedure;
            if (parameters != null)
            {
                foreach (SqlParameter parameter in parameters)
                {
                    if (parameter != null)
                    {
                        if (((parameter.Direction == ParameterDirection.InputOutput) || (parameter.Direction == ParameterDirection.Input)) && (parameter.Value == null))
                        {
                            parameter.Value = DBNull.Value;
                        }
                        command.Parameters.Add(parameter);
                    }
                }
            }
            return command;
        }

        public static void close()
        {
            if ((Conn != null) && (Conn.State == ConnectionState.Open))
            {
                Conn.Close();
            }
        }

        public static int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand cmd = new SqlCommand();
            using (Conn = new SqlConnection(strCon))
            {
                PrepareCommand(cmd, Conn, null, cmdType, cmdText, commandParameters);
                int num = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                Conn.Close();
                return num;
            }
        }

        private static SqlConnection getConn()
        {
            return new SqlConnection(strCon);
        }

        private static void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
            {
                conn.Open();
            }
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            if (trans != null)
            {
                cmd.Transaction = trans;
            }
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                foreach (SqlParameter parameter in cmdParms)
                {
                    cmd.Parameters.Add(parameter);
                }
            }
        }

        public static SqlDataReader RunProcedure(string storedProcName, IDataParameter[] parameters)
        {
            SqlConnection connection = getConn();
            try
            {
                connection.Open();
                SqlCommand command = BuildQueryCommand(connection, storedProcName, parameters);
                command.CommandType = CommandType.StoredProcedure;
                return command.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch
            {
                return null;
            }
        }

        public static int RunProcedure(string storedProcName, IDataParameter[] parameters, out int rowsAffected)
        {
            using (SqlConnection connection = new SqlConnection(strCon))
            {
                connection.Open();
                SqlCommand command = BuildIntCommand(connection, storedProcName, parameters);
                rowsAffected = command.ExecuteNonQuery();
                int num = (int)command.Parameters["ReturnValue"].Value;
                connection.Close();
                return num;
            }
        }

        public static DataSet RunProcedure(string storedProcName, IDataParameter[] parameters, string tableName)
        {
            using (SqlConnection connection = new SqlConnection(strCon))
            {
                DataSet dataSet = new DataSet();
                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = BuildQueryCommand(connection, storedProcName, parameters);
                adapter.Fill(dataSet, tableName);
                connection.Close();
                return dataSet;
            }
        }

        public static DataSet RunProcedure(string storedProcName, IDataParameter[] parameters, string tableName, int Times)
        {
            using (SqlConnection connection = new SqlConnection(strCon))
            {
                DataSet dataSet = new DataSet();
                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = BuildQueryCommand(connection, storedProcName, parameters);
                adapter.SelectCommand.CommandTimeout = Times;
                adapter.Fill(dataSet, tableName);
                connection.Close();
                return dataSet;
            }
        }


        /// <summary>
        /// 執行SQL，返回 dataTable 類型
        /// </summary>
        /// <returns></returns>
        public static DataTable ExecuteSqlReturnDataTable(string strSQL)
        {
            //using (SqlConnection connection = new SqlConnection(strCon))
            //{
            //    SqlDataAdapter sda = new SqlDataAdapter(strSQL, Conn);
            //    sda.Fill(dtData);
            //    Conn.Close();
            //    sda.Dispose();
            //}
            //catch (Exception ex)
            //{


            DataTable dtData = new DataTable();
            Conn = new SqlConnection(strCon);
            string err_str;
            try
            {
                SqlDataAdapter sda = new SqlDataAdapter(strSQL, Conn);
                sda.Fill(dtData);
                Conn.Close();
                sda.Dispose();
            }
            catch (Exception ex)
            {

                //MessageBox.Show(ex.Message);
                err_str = ex.Message;
            }
            finally
            {
                Conn.Close();
            }
            return dtData;

            //string err_str;
            //DataTable dtData = new DataTable();
            //try
            //{
            //    using (SqlConnection conn = new SqlConnection(strCon))
            //    {

            //        SqlDataAdapter sda = new SqlDataAdapter(strSQL, conn);
            //        sda.Fill(dtData);
            //        sda.Dispose();
            //    }
            //}
            //catch (Exception ex)
            //{

            //    err_str = ex.Message;
            //}
            //return dtData;
        }

        /// <summary>
        /// 執行SQL，返回 dataSet 類型
        /// </summary>
        /// <returns></returns>
        public static DataSet ExecuteSqlReturnDataSet(string strSQL)
        {
            using (SqlConnection connection = new SqlConnection(strCon))
            {
                DataSet dataSet = new DataSet();
                connection.Open();
                SqlDataAdapter sda = new SqlDataAdapter(strSQL, connection);
                sda.Fill(dataSet);
                sda.Dispose();
                connection.Close();
                return dataSet;
            }


            
        }

        /// <summary>
        ///執行存儲過程，返回dataTable 
        /// </summary>
        /// <param name="strSql"></param>
        /// <param name="paras"></param>
        /// <returns></returns>
        public static DataTable ExecuteProcedureRetrunDataTable(string strSql, SqlParameter[] paras)
        {
            using (SqlConnection connection = new SqlConnection(strCon))
            {
                DataTable dtData = new DataTable();
                connection.Open();
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;
                cmd.CommandText = strSql;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 2400;//連接20分鐘
                cmd.Parameters.AddRange(paras);
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dtData);
                sda.Dispose();
                return dtData;
            }

        }

        public static string ExecuteSqlUpdate(string strSql)
        {
            string result = "";
            Conn = new SqlConnection(strCon);
            Conn.Open();
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = Conn;
                cmd.CommandText = strSql;
                cmd.CommandTimeout = 1200;//連接20分鐘
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                result = ex.Message;//
            }
            finally
            {
                Conn.Close();
            }

            return result;
        }
    }
}
