using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankApp.InfraStructure.Migrations
{
    /// <inheritdoc />
    public partial class CustomerColumnModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "CustomerNumber",
                table: "Customers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CustomerNumber",
                table: "Customers",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
